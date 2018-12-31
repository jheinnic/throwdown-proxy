import {AsyncIterableX} from 'ix/asynciterable/asynciterablex';
import {chan, Chan, go, put} from 'medium';
import {AsyncSink} from 'ix/asyncsink';
import {defer} from 'ix/asynciterable/defer';
import {race} from 'ix/asynciterable/race';
import {map} from 'ix/asynciterable/pipe/map';
import {tap} from 'ix/asynciterable/pipe/tap';
import {take} from 'ix/asynciterable/pipe/take';
import {share} from 'ix/asynciterable/pipe/share';
// import {repeat} from 'ix/asynciterable/pipe/repeat';
import {timeout} from 'ix/asynciterable/pipe/timeout';
import {catchWith} from 'ix/asynciterable/pipe/catchwith';

import {iWatch, Watch} from '@jchptf/api';
import {
   EagerFixedIterableLoadStrategy, LoadResourcePoolStrategy, LoadResourcePoolStrategyConfig
} from '../../infrastructure/lib/semaphore/interfaces/load-strategy-config.interface';
import {GET_LEASE_MANAGER} from '../../infrastructure/lib/semaphore/resource-pool.constants';
import {LeaseManager} from './lease-manager.class';


interface PoolSizes
{
   readonly totalCount: number;
   readonly reserved: number;
   readonly free: number;
}

interface ILeasedResource<T extends object>
{
   [GET_LEASE_MANAGER]: LeaseManager<T>
}

// @ts-ignore
function preShareTap(label: string) {
   return tap({
      next(value: any) {
         console.log(`Pre-share for ${label} signalled ${value}`);
      },
      complete() {
         console.log(`Pre-share for ${label} signaled complete.`);
      },
      error(value: any) {
         console.error(`Pre-share for ${label} faulted ${value}`);
      }
   });
}

@iWatch()
export class TryMe<T extends object>
{
   private channelOpen: boolean = true;

   private recycledResources: AsyncSink<LeaseManager<T>>;

   private availableResourceQueue: AsyncIterableX<LeaseManager<T>>;

   private poolSizes: PoolSizes = {
      totalCount: 0,
      reserved: 0,
      free: 0
   };

   constructor(
      private readonly resourceSupplyConfig: LoadResourcePoolStrategyConfig<T>,
      private readonly returnToPoolQueue: AsyncSink<T>,
      private readonly leaseRequestsChan: Chan<T>)
   {
      this.recycledResources = new AsyncSink<LeaseManager<T>>();
      this.availableResourceQueue = this.buildAvailableResourceQueue();

      console.log('Fire for requests');
      go(this.scanForRequests.bind(this))
         .then(() => {
            console.log('Process manager stopping');
         })
         .catch((err: any) => {
            console.error('Process manager error:', err);
         });

      console.log('Fire for returns');
      go(this.scanForReturns.bind(this))
   }

   public async scanForRequests(): Promise<void>
   {
      console.log('Enter scanForRequests');

      while (this.channelOpen) {
         let next: LeaseManager<T>
         for await (next of this.availableResourceQueue) {
            const proxy = next.publish();
            this.notifyReserved();

            console.log('Granting', proxy);
            if (await put(this.leaseRequestsChan, proxy)) {
               console.log('Granted', proxy);
            } else {
               console.error('Shutting down on closed channel.');
               this.channelOpen = false;
               break;
            }
         }

         // console.log('Sleeping outer block of scanForRequests');
         // await (
         //    sleep(10)
         // );
         console.log('Looping outer block of scanForRequests');
      }

      console.log('Exit scanForRequests');
   }

   public async scanForReturns(): Promise<void>
   {
      console.log('Enter scanForReturns');

      const returnIterable =
         AsyncIterableX.from(this.returnToPoolQueue)
            .pipe(
               map(
                  (resource: T): LeaseManager<T> => {
                     if (this.isOwnedResource(resource)) {
                        const leaseManager: LeaseManager<T> = resource[GET_LEASE_MANAGER];
                        leaseManager.recycle();

                        console.log('Put back 1', leaseManager.wetArtifact);
                        this.notifyFree();

                        return leaseManager;
                     }

                     throw new Error(`${resource} is not an owned resource`);
                  }
               )
               // ).pipe(
               // share()
               // preShareTap('scanForReturns')
            );

      while (this.channelOpen) {
         let leaseManager: LeaseManager<T>;
         for await (leaseManager of returnIterable) {
            console.log('Put back 2', leaseManager.wetArtifact);
            // leaseManager.release();
            this.recycledResources.write(leaseManager);
         }

         console.log('Looping outer block of scanForReturns');
      }

      console.log('Exit scanForReturns');
   }

   private isOwnedResource(resource: any): resource is ILeasedResource<T>
   {
      return ((!!resource[GET_LEASE_MANAGER]) &&
         (resource[GET_LEASE_MANAGER]['parentSemaphore'] === this));
   }

   private buildAvailableResourceQueue(): AsyncIterableX<LeaseManager<T>>
   {
      const baseRecycleSupply: AsyncIterableX<LeaseManager<T>> =
         AsyncIterableX.from(this.recycledResources)
            // .pipe(
               // preShareTap('basicRecycle'),
               // share(),
               // take(1),
               // preShareTap('postBasicRecycle'),
            // );

      const baseNewSupply =
         this.getNewResourceIterable()
            .pipe(
               // preShareTap('basicNewSupply'),
               share(),
               // preShareTap('postBasicNewSupply'),
               // take(1),
            );

      const newSupply =
         defer(
            () => race(
            // baseNewSupply.pipe(
            //    tap({
            //       next: (_value: LeaseManager<T>) => {
            //          console.log('In allocation tap');
            //          this.notifyAllocated();
            //       }
            //    })
            // ),
            baseNewSupply,
            baseRecycleSupply //.pipe(
               // tap({
               //    next: (value: LeaseManager<T>) => {
               //       console.log('In post-allocate recycle supply tap for', value.wetArtifact);
               //    }
               // }),
            // )
            )
         );

      return baseRecycleSupply.pipe(
         // tap({
         //    next: (value: LeaseManager<T>) => {
         //       console.log('In pre-allocate recycle supply tap for', value.wetArtifact);
         //    }
         // }),
         timeout(5000),
         catchWith(
            (_err: any) => {
               console.log('Falling back to newSupply pipeline after timeout');
               return newSupply
            }
         ),
         take(1)
         // repeat()
      );
   }

   private getNewResourceIterable(): AsyncIterableX<LeaseManager<T>>
   {
      switch (this.resourceSupplyConfig.loadStrategy) {
         case LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE:
         {
            return AsyncIterableX.from(
               this.resourceSupplyConfig.source,
               function (this: TryMe<T>, resource: T): LeaseManager<T> {
                  return new LeaseManager<T>(this, resource);
               }, this);
         }

         case LoadResourcePoolStrategy.EAGER_FIXED_ASYNC_ITERABLE:
         {
            return AsyncIterableX.from(
               this.resourceSupplyConfig.source,
               function (this: TryMe<T>, resource: T): LeaseManager<T> {
                  return new LeaseManager<T>(this, resource);
               }, this);
         }

         case LoadResourcePoolStrategy.EAGER_FIXED_CALL_FACTORY:
         {
            const factory = this.resourceSupplyConfig.factory;

            return AsyncIterableX.range(1, this.resourceSupplyConfig.poolSize)
               .pipe(
                  map((): LeaseManager<T> =>
                     new LeaseManager<T>(this, factory())));
         }

         default:
         {
            return this as never;
         }
      }
   }


   private notifyFree()
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         reserved: oldPoolSizes.reserved - 1,
         free: oldPoolSizes.free + 1
      };
      this.poolSizes = newPoolSizes;
      this.notifyWatches(oldPoolSizes, newPoolSizes);
   }

   private notifyReserved()
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         reserved: oldPoolSizes.reserved + 1,
         free: oldPoolSizes.free - 1
      };
      this.poolSizes = newPoolSizes;
      this.notifyWatches(oldPoolSizes, newPoolSizes);
   }

   public addWatch(_id: string, _fn: Watch<PoolSizes>): boolean
   {
      return false;
   }

   public notifyWatches(_oldState: PoolSizes, _newState: PoolSizes): void
   {
   }

   public removeWatch(_id: string): boolean
   {
      return false;
   }
}

class Thing
{
   public constructor(private value: number) { }

   public doIt(): void
   {
      console.log('Doing it for ' + this.value);
   }
}

const config: EagerFixedIterableLoadStrategy<Thing> = {
   name: 'things',
   loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE,
   source: [new Thing(1), new Thing(2), new Thing(3), new Thing(4)]
}
const recycleSink = new AsyncSink<Thing>();
const leaseChan: Chan<Thing> = chan();
const canvasPool: TryMe<Thing> = new TryMe<Thing>(config, recycleSink, leaseChan);


canvasPool.addWatch(
   'strtest', (id: string, _old: PoolSizes, newSizes: PoolSizes) => {
      console.log('watch notifier receives', newSizes, id);
   }
);


async function runScenario() {
   console.log('Enter runScenario');
   const things: Thing[] = new Array<Thing>(4);

   console.log('Waiting to least things[0]');
   things[0] = await leaseChan as Thing;
   things[0].doIt();

   console.log('Waiting to least things[1]');
   things[1] = await leaseChan as Thing;
   things[1].doIt();

   console.log('Returning things[0]');
   recycleSink.write(things[0]);

   console.log('Waiting to least things[2]');
   things[2] = await leaseChan as Thing;
   things[2].doIt();

   things[1].doIt();
   console.log('Waiting to return things[1]');
   recycleSink.write(things[1]);

   things[3] = await leaseChan as Thing;
   things[3].doIt();

   // console.log(things);

   recycleSink.write(things[3]);
   recycleSink.write(things[2]);

   try {
      things[1].doIt();
      console.error('This should have failed!');
   } catch(e) {
      console.log('Got expected exception about things[1]!');
   }

   console.log('Exit runScenario');
};

let repeatCount = 5;

async function iterate()
{
   if (--repeatCount <= 0) {
      return;
   }

   console.log(`Running with ${repeatCount} iterations remaining!`);
   try {
      await go(runScenario);
      console.log(`** End of iteration ${5 - repeatCount}.  Attempting to loop.\n\n`);
      await iterate();
   } catch(err) {
      console.error(err);
   }
}

iterate().then(
   () => {
      console.log('** End of program\n\n');
   }
).catch(
   (err: any) => {
      console.error('Abnormal end of program', err);
   }
);

function keepAlive() {
   setTimeout(keepAlive, 10000);
}

keepAlive();