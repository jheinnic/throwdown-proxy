import {Chan, go, put, sleep} from 'medium';
import {map as txMap} from 'transducers-js';
import {map, tap, toArray} from 'rxjs/operators';
import {from, range} from 'rxjs';

import '@jchptf/reflection';
import {ChanBufferType, ConcurrentWorkFactory, IConcurrentWorkFactory} from '@jchptf/coroutines';
import {iWatch, Watch} from '@jchptf/api';

import {
   EagerFixedIterableLoadStrategy, LoadResourcePoolStrategy, LoadResourcePoolStrategyConfig
} from '../../infrastructure/lib/semaphore/interfaces/load-strategy-config.interface';
import {GET_LEASE_MANAGER} from '../../infrastructure/lib/semaphore/resource-pool.constants';
import {LeaseManager} from './lease-manager.class';
import * as util from 'util';


interface PoolSizes
{
   readonly totalCount: number;
   readonly ready: number;
   readonly inUse: number;
   readonly recycling: number;
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

   private resources?: Array<LeaseManager<T>>;

   private recycledResources?: Chan<T, LeaseManager<T>>;

   private resourceRequests?: Chan<LeaseManager<T>, T>;

   private poolSizes: PoolSizes = {
      totalCount: 0,
      ready: 0,
      inUse: 0,
      recycling: 0
   };

   constructor(
      private readonly resourceSupplyConfig: LoadResourcePoolStrategyConfig<T>,
      private readonly concurrentWorkFactory: IConcurrentWorkFactory)
   { }

   async init(): Promise<void>
   {
      this.resources = await this.acquireResources();
      const resourceCount = this.resources.length;

      this.recycledResources =
         this.concurrentWorkFactory.createTxChan(
            txMap((resource: T): LeaseManager<T> => {
               if (this.isOwnedResource(resource)) {
                  const retVal: LeaseManager<T> = resource[GET_LEASE_MANAGER];
                  if (retVal.recycle()) {
                     this.notifyRecycled(retVal.wetArtifact);
                  } else {
                     this.notifyReturned(retVal.wetArtifact);
                  }

                  return retVal;
              }

               throw new Error(`Cannot recycle ${resource}.  It has not been registered as a dynamic resource accessor yet.`);
            }),
            resourceCount, ChanBufferType.fixed );
      this.resourceRequests =
         this.concurrentWorkFactory.createTxChan(
            txMap((leaseMgr: LeaseManager<T>): T => {
               return leaseMgr.publish();
            }),
            resourceCount, ChanBufferType.fixed);

      this.poolSizes = {
         totalCount: resourceCount,
         ready: 0,
         inUse: 0,
         recycling: resourceCount
      };

      console.log('Fire for requests');
      let ii;
      for( ii = 0; ii < resourceCount; ii++ ) {
         await put(this.recycledResources!, this.resources[ii].publish());
      }
      for( ii = 0; ii < resourceCount; ii++ ) {
         const managerId = ii;
         go(this.scanForRequests.bind(this))
            .then(() => {
               console.log(`Process manager ${managerId} exited normally`);
            })
            .catch((err: any) => {
               console.error(`Process manager ${managerId} exited exceptionally:`, err);
            });
      }
      await(
         sleep(5)
      );
   }

   private async scanForRequests(): Promise<void>
   {
      console.log('Enter scanForRequests');

      while (this.channelOpen) {
         let nextMgr: LeaseManager<T> | object =
            await this.recycledResources!;
         // this.notifyRecycling();

         if (nextMgr instanceof LeaseManager) {
            await put(this.resourceRequests!, nextMgr);

            this.notifyReady(nextMgr.wetArtifact);
            // console.log('Granted', nextMgr, nextMgr.wetArtifact);
         } else {
            this.channelOpen = false;

            console.error('Shutting down on a closed channel');
         }

         // console.log('Looping outer block of scanForRequests');
      }

      console.log('Exit scanForRequests');
   }

   private isOwnedResource(resource: any): resource is ILeasedResource<T>
   {
      return ((!!resource[GET_LEASE_MANAGER]) &&
         (resource[GET_LEASE_MANAGER]['parentPool'] === this));
   }

   /*
   private async dadadadada(): Promise<Array<LeaseManager<T>>>
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
   */

   private async acquireResources(): Promise<Array<LeaseManager<T>>>
   {
      switch (this.resourceSupplyConfig.loadStrategy) {
         case LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE:
         {
            return await from(this.resourceSupplyConfig.resources)
               .pipe(
                  map(
                     (resource: T): LeaseManager<T> => {
                        return new LeaseManager<T>(this, resource);
                     }
                  ),
                  toArray()
               ).toPromise();
         }

         case LoadResourcePoolStrategy.EAGER_FIXED_ASYNC_ITERABLE:
         {
            const resources: Array<LeaseManager<T>> = new Array<LeaseManager<T>>();
            let nextResource: T;
            for await (nextResource of this.resourceSupplyConfig.resources) {
               resources.push(
                  new LeaseManager<T>(this, nextResource)
               );
            }

            return resources;
         }

         case LoadResourcePoolStrategy.EAGER_FIXED_CALL_FACTORY:
         {
            const factory = this.resourceSupplyConfig.factory;

            return await range(1, this.resourceSupplyConfig.poolSize)
               .pipe(
                  map((): LeaseManager<T> =>
                     new LeaseManager<T>(this, factory())),
                  toArray()
               ).toPromise();
         }

         default:
         {
            return this as never;
         }
      }
   }

   notifyInUse(resource: T)
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         ready: oldPoolSizes.ready - 1,
         inUse: oldPoolSizes.inUse + 1,
         recycling: oldPoolSizes.recycling
      };
      this.poolSizes = newPoolSizes;
      console.log(`In-Use: ${util.inspect(resource, true, 5, true)}`)
      this.notifyWatches(oldPoolSizes, newPoolSizes);
   }

   private notifyReturned(resource: T)
   {
      // const oldPoolSizes = this.poolSizes;
      // const newPoolSizes = {
      //    totalCount: oldPoolSizes.totalCount,
      //    ready: oldPoolSizes.ready - 1,
      //    inUse: oldPoolSizes.inUse + 1,
      //    recycling: oldPoolSizes.recycling
      // };
      // this.poolSizes = newPoolSizes;
      console.log(`Returned unused: ${util.inspect(resource, true, 5, true)}`)
   }

   private notifyRecycled(resource: T)
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         ready: oldPoolSizes.ready,
         inUse: oldPoolSizes.inUse - 1,
         recycling: oldPoolSizes.recycling + 1
      };
      this.poolSizes = newPoolSizes;
      console.log(`Recycling: ${util.inspect(resource, true, 5, true)}`)
      this.notifyWatches(oldPoolSizes, newPoolSizes);
   }

   private notifyReady(resource: T)
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         ready: oldPoolSizes.ready + 1,
         inUse: oldPoolSizes.inUse,
         recycling: oldPoolSizes.recycling - 1
      };
      this.poolSizes = newPoolSizes;
      console.log(`Prepared: ${util.inspect(resource, true, 5, true)}`);
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

   public getReturnChan(): Chan<T, LeaseManager<T>>|undefined {
      return this.recycledResources
   }

   public getReservationChan(): Chan<LeaseManager<T>, T>|undefined
   {
      return this.resourceRequests
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
   resources: [new Thing(1), new Thing(2), new Thing(3), new Thing(4)]
}
const workFactory = new ConcurrentWorkFactory();

const canvasPool: TryMe<Thing> = new TryMe<Thing>(config, workFactory);
canvasPool.addWatch(
   'strtest', (id: string, _old: PoolSizes, newSizes: PoolSizes) => {
      console.log('watch notifier receives', newSizes, id);
   }
);


async function runTests()
{
   await canvasPool.init();
   const leaseChan = canvasPool.getReservationChan();
   const recycleChan = canvasPool.getReturnChan();

   async function runScenario()
   {
      console.log('Enter runScenario');
      const things: Thing[] = new Array<Thing>(4);

      console.log('Waiting to least things[0]');
      things[0] = await leaseChan as Thing;
      things[0].doIt();

      console.log('Waiting to least things[1]');
      things[1] = await leaseChan as Thing;
      things[1].doIt();

      console.log('Returning things[0]');
      await put(recycleChan!, things[0]);

      console.log('Waiting to least things[2]');
      things[2] = await leaseChan as Thing;
      things[2].doIt();

      things[1].doIt();
      console.log('Waiting to return things[1]');
      await put(recycleChan!, things[1]);

      things[3] = await leaseChan as Thing;
      things[3].doIt();

      // console.log(things);

      await put(recycleChan!, things[3]);
      await put(recycleChan!, things[2]);

      try {
         things[1].doIt();
         console.error('This should have failed!');
      } catch (e) {
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
      await(sleep(12000));

      try {
         await go(runScenario);
         console.log(`** End of iteration ${5 - repeatCount}.  Attempting to loop.\n\n`);
         await iterate();
      } catch (err) {
         console.error(err);
      }

      await(sleep(12000));
   }

   await iterate()
      .then(
         () => {
            console.log('** End of program\n\n');
         }
      )
      .catch(
         (err: any) => {
            console.error('Abnormal end of program', err);
         }
      );
}

runTests().then(
   () => {
      console.log('Terminating at end-of-program');
   }
).catch(
   (err) => {
      console.error(`Terminated exceptionally:`, err);
   }
);

// function keepAlive() {
//    setTimeout(keepAlive, 10000);
// }
// keepAlive();