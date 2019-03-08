import { Chan, go, put, sleep } from 'medium';
import { Worker } from 'cluster';
// import {cluster.Worker} from 'canvas';
import {IAdapter} from '@jchptf/api';
import * as util from 'util';

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
   acquireChan: Chan<any, Worker>,
   returnChan: Chan<Worker, any>
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

      console.log(`${userId} :: ${serviceTime} -> ${nextOpTime}`)

      const t0 = Date.now();
      const thing: Worker = await acquireChan;
      const t1 = Date.now();
      const pSend = util.promisify(thing.send.bind(thing));
      thing.on('message', (msg) => {
         console.log('GOT', msg);
      });

      await pSend(serviceTime, undefined);
      await sleep(serviceTime);

      const t2 = Date.now();
      // await new Promise((resolve, _rejects) => {
      //    thing.on('message', (event: any) => {
      //       console.log('Intercepted', event);
      //       resolve(event);
      //    })
      // });
      // const t2b = Date.now();
      // console.log('Intercepted after', t2b - t2);
      await put(returnChan, thing);
      const t3 = Date.now();
      await sleep(nextOpTime);
      const t4 = Date.now();

      console.log(`${userId} -- ${ii + 1} of ${userWorkload} ::\n ** ${t1 - t0} to acquire\n ** ${t2
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
   acquireChan: Chan<any, Worker>,
   recycleChan: Chan<Worker, any>)
{
   console.log(averageArrivalMs, averageInteropMs, meanServiceTime, serviceTimeStdDev, userErlangs, userWorkload);
   let ii = 0;
   let promises: Array<Promise<void>> = new Array<Promise<void>>(userErlangs);
   for (ii = 0; ii < userErlangs; ii++) {
      const simulateUser = async function()
      {
         await runScenario(
            ii, averageInteropMs, meanServiceTime, serviceTimeStdDev, userWorkload, acquireChan!,
            recycleChan!
         );
      }

      console.log(
         'Launching user', (
            ii + 1
         ));
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

export function simulateWorkload(
   acquireChan: IAdapter<Chan<any, Worker>>, releaseChan: IAdapter<Chan<Worker, any>>)
{
   console.log('Load test factory entered!');
   const averageArrivalMs = 1500;
   const averageInteropMs = 650;
   const meanServiceTime = 250;
   const serviceTimeStdDev = 40;
   const userErlangs = 5;
   const userWorkload = 6;

   console.log('Running tests with', acquireChan, releaseChan);
   return runTests(
      averageArrivalMs,
      averageInteropMs,
      meanServiceTime,
      serviceTimeStdDev,
      userErlangs,
      userWorkload,
      acquireChan.unwrap(),
      releaseChan.unwrap()
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

