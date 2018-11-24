import {any, chan, Chan, go, put, repeat, repeatTake, sleep} from 'medium'

const workers: any[] = [];
const numWorkers = 4;
const numTasks = 50;

for (let ii = 0; ii < numWorkers; ii++) {
   const thisChan: Chan<[string, Chan<number>]> = chan();
   const identity = ii;
   repeatTake(thisChan, async function (message: [string, Chan<number>], _acc) {
      console.log('Worker ' + identity + ' reads ' + message[0]);
      await sleep(75 + identity * 60);
      return put(message[1], ii);
   }, true);

   workers.push(thisChan);
}

const pending: Promise<number>[] = [];

repeat(
   async function(ii) {
      const message = 'Task #' + ii;
      const retChan = chan();
      pending.push(retChan);
      console.log('Sending ' + message);
      const candidates: [Chan<any>, any][] = [];
      for (let jj = 0; jj < numWorkers; jj++) {
         candidates.push([workers[jj], [message + ' for ' + jj, retChan]]);
      }

      const result = await any(...candidates);
      pending[ii] = await retChan;
      console.log(result[0], pending[ii]);

      return (ii < numTasks) ? ii + 1 : false;
   }, 1
);


// Promise.all(pending)
//    .then(
//       (values: number[]) => { console.log('All tasks done', values); }
//    )
//    .catch(
//       (err: any) => { console.error(err); }
//    );

// sourcePromise.then((value: void) => {
//    console.log('Outer loop', value);
// })
//    .catch((err: any) => {
//       console.error(err);
//    });

// Promise.all(gone)
//    .then(
//       (value: any[]) => { console.log('Worker loop', value); }
//    )
//    .catch(
//       (err: any) => { console.error(err); }
//    );

// go(async function () {
//    await sleep(10000);
// });