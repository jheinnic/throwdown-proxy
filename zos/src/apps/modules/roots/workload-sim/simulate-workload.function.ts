import { go, sleep } from 'medium';
import { Worker } from 'cluster';
// import {cluster.Worker} from 'canvas';
// import {IAdapter} from '@jchptf/api';
import * as util from 'util';
import { IResourceSemaphore } from '@jchptf/semaphore';

// @ts-ignore
const poissonProcess = require('poisson-process');
// @ts-ignore
const randomNormal = require('random-normal');


async function runScenario(
   userId: number,
   averageInteropMs: number,
   meanServiceTime: number,
   serviceTimeStdDev: number,
   userWorkload: number,
   workerSemaphore: IResourceSemaphore<Worker>,
)
{
   let ii: number;
   for (ii = 0; ii < userWorkload; ii++) {
      const serviceTime =
         Math.round(
            randomNormal({
               mean: meanServiceTime,
               dev: serviceTimeStdDev
            })
         );
      const nextOpTime =
         Math.round(
            poissonProcess.sample(averageInteropMs)
         );

      console.log(`${userId}, ${ii} :: ${serviceTime} -> ${nextOpTime}`);

      const t0 = Date.now();
      // let t1: number, t1a: number, t2: number, t3a: number;
      let [t1, t1a, t2, t2a] = [-1, -1, -1, -1];
      // const thing: Worker|CLOSED = await acquireChan;
      await workerSemaphore.borrowResource<void>(
         async (thing: Worker): Promise<void> => {
            const pSend = util.promisify(thing.send);
            t1a = 0;

            thing.on('message', (msg) => {
               console.log(`Received ${msg} after ${Date.now() - t1a} for ${userId}, ${ii + 1}`);
            });

            t1a = Date.now();
            await pSend(
               `Sending request of ${serviceTime} for ${userId}, ${ii + 1}`, 'send handle');
            t1 = Date.now();
            await sleep(serviceTime);
            t2a = Date.now();
            await pSend(`served for ${serviceTime}`, 'send handle');
            t2 = Date.now();

            return;
         }
      );
      // await new Promise((resolve, _rejects) => {
      //    thing.on('message', (event: any) => {
      //       console.log('Intercepted', event);
      //       resolve(event);
      //    })
      // });
      // const t2b = Date.now();
      // console.log('Intercepted after', t2b - t2);
      // await put(returnChan, thing);

      const t3 = Date.now();
      await sleep(nextOpTime);
      const t4 = Date.now();

      console.log(
         `Worker ${userId}, #${ii + 1} binding (${t1 - t1a}) and sending (${t2 - t2a}) should both be negligible`);
      console.log(`${userId}, #${ii + 1} of ${userWorkload} ::\n ** ${t1 - t0} to acquire\n ** ${t2
      - t1} of ${serviceTime} service time\n ** ${t3 - t2} to recycle\n ** ${t4
      - t3} of ${nextOpTime} to next op`);
   }

   console.log('Exit runScenario');
}

async function runTests(
   averageArrivalMs: number,
   averageInteropMs: number,
   meanServiceTime: number,
   serviceTimeStdDev: number,
   userErlangs: number,
   userWorkload: number,
   workerSemaphore: IResourceSemaphore<Worker>)
{
   console.log(averageArrivalMs, averageInteropMs, meanServiceTime, serviceTimeStdDev, userErlangs, userWorkload);
   let ii = 0;
   let promises: Array<Promise<void>> = new Array<Promise<void>>(userErlangs);
   for (ii = 0; ii < userErlangs; ii++) {
      const simulateUser = async function()
      {
         await runScenario(
            ii, averageInteropMs, meanServiceTime, serviceTimeStdDev,
            userWorkload, workerSemaphore);
      }

      console.log(`Launching user #${ii + 1}`);
      promises[ii] = go(simulateUser);

      const nextUserIn = Math.round(poissonProcess.sample(averageArrivalMs));
      await sleep(nextUserIn);
   }

   const bigPromise = Promise.all(promises);
   try {
      await bigPromise;
      console.log('Finished successfully!');
   } catch (err) {
      console.error('Failed with error', err);
   }
}


// const averageArrivalMs = 7500;
// const averageInteropMs = 1200;
// const meanServiceTime = 120;
// const serviceTimeStdDev = 18;
// const userErlangs = 20;
// const userWorkload = 80;

export function simulateWorkload(workerSemaphore: IResourceSemaphore<Worker>)
{
   console.log('Load test factory entered!');
   const averageArrivalMs = 1500;
   const averageInteropMs = 650;
   const meanServiceTime = 250;
   const serviceTimeStdDev = 40;
   const userErlangs = 5;
   const userWorkload = 6;

   console.log('Running tests with', workerSemaphore);
   return runTests(
      averageArrivalMs,
      averageInteropMs,
      meanServiceTime,
      serviceTimeStdDev,
      userErlangs,
      userWorkload,
      workerSemaphore,
      // acquireChan.unwrap(),
      // releaseChan.unwrap()
   )
      .then(
         () => {
            console.log('Terminating at end-of-program');
            return 2542;
         }
      )
      .catch(
         (err) => {
            console.error(`Terminated exceptionally:`, err);
            return -1;
         }
      );
}

