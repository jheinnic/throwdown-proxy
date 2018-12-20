import {Chan, go, put, sleep} from 'medium';
import {map as txMap} from 'transducers-js';
import {map, toArray} from 'rxjs/operators';
import {from, range} from 'rxjs';

// @ts-ignore
const poissonProcess = require('poisson-process');
// @ts-ignore
const randomNormal = require('random-normal');

import '@jchptf/reflection';
import {ChanBufferType, ConcurrentWorkFactory, IConcurrentWorkFactory} from '@jchptf/coroutines';
import {iWatch, Watch} from '@jchptf/api';

import {
   EagerFixedIterableLoadStrategy, LoadResourcePoolStrategy, LoadResourcePoolStrategyConfig
} from '../../infrastructure/lib/semaphore/interfaces/load-strategy-config.interface';
import {GET_LEASE_MANAGER} from '../../infrastructure/lib/semaphore/resource-pool.constants';
import {LeaseManager} from './lease-manager.class';
// import * as os from 'os';
// import * as util from 'util';


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

      // console.log('Fire for requests');
      let ii;
      for( ii = 0; ii < resourceCount; ii++ ) {
         await put(this.recycledResources!, this.resources[ii].publish());
      }
      for( ii = 0; ii < resourceCount; ii++ ) {
         const managerId = ii;
         go(this.scanForRequests.bind(this))
            .then(() => {
               console.log(`Resource manager ${managerId} exited normally`);
            })
            .catch((err: any) => {
               console.error(`Resource manager ${managerId} exited exceptionally:`, err);
            });
      }
      await(
         sleep(5)
      );
   }

   private async scanForRequests(): Promise<void>
   {
      // console.log('Enter scanForRequests');

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

   notifyInUse(_resource: T)
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         ready: oldPoolSizes.ready - 1,
         inUse: oldPoolSizes.inUse + 1,
         recycling: oldPoolSizes.recycling
      };
      this.poolSizes = newPoolSizes;
      // console.log(`In-Use: ${util.inspect(resource, true, 5, true)}`)
      this.notifyWatches(oldPoolSizes, newPoolSizes);
   }

   private notifyReturned(_resource: T)
   {
     // console.log(`Returned unused: ${util.inspect(resource, true, 5, true)}`)
   }

   private notifyRecycled(_resource: T)
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         ready: oldPoolSizes.ready,
         inUse: oldPoolSizes.inUse - 1,
         recycling: oldPoolSizes.recycling + 1
      };
      this.poolSizes = newPoolSizes;
      // console.log(`Recycling: ${util.inspect(resource, true, 5, true)}`)
      this.notifyWatches(oldPoolSizes, newPoolSizes);
   }

   private notifyReady(_resource: T)
   {
      const oldPoolSizes = this.poolSizes;
      const newPoolSizes = {
         totalCount: oldPoolSizes.totalCount,
         ready: oldPoolSizes.ready + 1,
         inUse: oldPoolSizes.inUse,
         recycling: oldPoolSizes.recycling - 1
      };
      this.poolSizes = newPoolSizes;
      // console.log(`Prepared: ${util.inspect(resource, true, 5, true)}`);
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
   resources: [
      new Thing(1), new Thing(2), new Thing(3), new Thing(4),
      new Thing(5), new Thing(6), new Thing(7), new Thing(8),
      new Thing(9), new Thing(10), new Thing(11), new Thing(12),
      new Thing(13), new Thing(14), new Thing(15), new Thing(16),
      new Thing(17), new Thing(18), new Thing(19), new Thing(20),
   ]
}
const workFactory = new ConcurrentWorkFactory();

const canvasPool: TryMe<Thing> = new TryMe<Thing>(config, workFactory);
canvasPool.addWatch(
   'strtest', (id: string, _old: PoolSizes, newSizes: PoolSizes) => {
      console.log('watch notifier receives', newSizes, id);
   }
);


async function runScenario(
   userId: number,
   averageInteropMs: number,
   meanServiceTime: number,
   serviceTimeStdDev: number,
   userWorkload: number,
   acquireChan: Chan<any, Thing>,
   returnChan: Chan<Thing, any>
)
{
   let ii: number;
   for (ii = 0; ii < userWorkload; ii++) {
      const serviceTime =
         Math.round(
            randomNormal({mean: meanServiceTime, dev: serviceTimeStdDev})
         );
      const nextOpTime =
         Math.round(
            poissonProcess.sample(averageInteropMs)
         );

      // console.log(`${userId} :: ${serviceTime} -> ${nextOpTime}`)

      const t0 = new Date().valueOf()
      const thing = await acquireChan;
      const t1 = new Date().valueOf()
      await sleep(serviceTime);
      const t2 = new Date().valueOf()
      await put(returnChan, thing);
      const t3 = new Date().valueOf()
      await sleep(nextOpTime);
      const t4 = new Date().valueOf()

      console.log(`${userId} -- ${ii+1} of ${userWorkload} ::\n ** ${t1-t0} to acquire\n ** ${t2-t1} of ${serviceTime} service time\n ** ${t3-t2} to recycle\n ** ${t4 - t3} of ${nextOpTime} to next op`);
   }

   console.log('Exit runScenario');
}

async function runTests(
   averageArrivalMs: number,
   averageInteropMs: number,
   meanServiceTime: number,
   serviceTimeStdDev: number,
   userErlangs: number,
   userWorkload: number )
{
   await canvasPool.init();
   const acquireChan = canvasPool.getReservationChan();
   const recycleChan = canvasPool.getReturnChan();

   let ii = 0;
   let promises: Array<Promise<void>> = new Array<Promise<void>>(userErlangs);
   for (ii = 0; ii < userErlangs; ii++) {
      async function simulateUser() {
         await runScenario(
            ii, averageInteropMs, meanServiceTime, serviceTimeStdDev, userWorkload, acquireChan!, recycleChan!
         );
      }

      promises[ii] = go(simulateUser);

      const nextUserIn = Math.round(poissonProcess.sample(averageArrivalMs));
      await sleep(nextUserIn);
   }

   const bigPromise = Promise.all(promises);
   try {
      await bigPromise;
      console.log('Finished successfully!');
   } catch(err) {
      console.error('Failed with error', err);
   }
}


// const averageArrivalMs = 7500;
// const averageInteropMs = 1200;
// const meanServiceTime = 120;
// const serviceTimeStdDev = 18;
// const userErlangs = 20;
// const userWorkload = 80;

const averageArrivalMs = 1500;
const averageInteropMs = 650;
const meanServiceTime = 250;
const serviceTimeStdDev = 40;
const userErlangs = 150;
const userWorkload = 100;

runTests(
   averageArrivalMs, averageInteropMs, meanServiceTime, serviceTimeStdDev, userErlangs, userWorkload
).then(
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