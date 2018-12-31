import {chan, sleep, go, any, Chan, CLOSED} from 'medium'
import * as util from 'util';

const workers: any[] = [];
const gone: Promise<any>[] = [];
const numWorkers = 4;
const numTasks = 50;

for (let ii = 0; ii < numWorkers; ii++ ) {
    const thisChan: Chan<[string, Function, Function]> = chan();
    gone.push(
       go(async function() {
          const identity = ii;
          while (true) {
             await sleep(75 + identity * 60);
             const message: CLOSED|[string, Function, Function] = await thisChan;
             if (message instanceof Array) {
                console.log("Worker " + identity + " reads " + message[0]);
                await sleep(75 + identity * 60);
                message[1](ii);
             }
          }
       })
    );

    workers.push(thisChan);
}

const pending: Promise<number>[] = [];

const sourcePromise: Promise<void> = go(async function() {
   for(let ii = 0; ii < numTasks; ii++ ) {
       const message = 'Task #' + (ii+1);
       console.log('Sending ' + message);
       pending.push(new Promise(async (resolve, reject) => {
          const candidates: [Chan<[string, Function, Function]>, [string, Function, Function]][] = [];
          for(let jj = 0; jj < numTasks; jj++ ) {
             candidates.push([workers[jj], [message + ' for ' + jj, resolve, reject]]);
          }

          await any(candidates[0], candidates[1], candidates[2], candidates[3]);
       }));
   }

   return await Promise.all(pending.slice(0, 10));
});

Promise.all(pending).then(
   (values: number[]) => { console.log('All tasks done', values); }
).catch(
   (err: any) => { console.error(err); }
);

sourcePromise.then((value: void) => {
   console.log('Outer loop', value);
}).catch((err: any) => {
   console.error(err);
});

Promise.all(gone).then(
   (value: any[]) => { console.log('Worker loop', value); }
).catch(
   (err: any) => { console.error(err); }
);

