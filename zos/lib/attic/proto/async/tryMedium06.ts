import {any, go, chan, Chan, put, repeatTake, sleep, CLOSED} from 'medium'

const numWorkers = 4;
const numSources = 1;
const numTasks = 30;
const MAX_SLOTS = 64;

const workers: any[] = [];
const workerSemaphore: Chan<number> = chan(MAX_SLOTS);

console.log('Spawning workers');

// {
//    const identity = 0;
//    const thisChan: Chan<[string, Chan<number>]> = chan();
//    workers.push(thisChan);
//
//    repeatTake(thisChan, async function (message: [string, Chan<number>], _acc) {
//       console.log('Worker ' + identity + ' reads ' + message[0]);
//       await sleep(250 + (
//          Math.random() * 5000
//       ));
//       console.log('Worker ' + identity + ' replied to ' + message[0]);
//       await put(message[1], 0);
//
//       return identity;
//    }, identity);
// }
for (let ii = 0; ii < numWorkers; ii++) {
   const identity = ii;
   const thisChan: Chan<[string, Chan<number>]> = chan();
   workers.push(thisChan);
   // put(workerSemaphore, identity).then(function() {
      repeatTake(thisChan, async function (message: [string, Chan<number>], _acc) {
         // console.log('Worker ' + identity + ' reads ' + message[0]);
         await sleep(250 + (Math.random() * 1000));
         console.log('Worker ' + identity + ' replied to ' + message[0]);
         await put(message[1], ii);

         return identity;
      }, identity);
   // }).catch(console.error);
}

// type Slot = Nominal<number, 'SemaphoreSlot'>;
const sourceSemaphore: Chan<[Chan<number>]> = chan(MAX_SLOTS);
console.log('Feeding source channels');
go(async function() {
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(sourceSemaphore, [chan()]);
   console.log(1);
   await put(workerSemaphore, 42);
   console.log(2);
// put(sourceSemaphore, 9);
// put(sourceSemaphore, 10);
   console.log('Source semaphore loaded');
}).then(function() {
   console.log('Spawning sources');
   for (let kk = 0; kk < numSources; kk++) {
      repeatTake(
         sourceSemaphore,
         async function (retChan: [Chan<number>], state) {
            // console.log('On entry, ' + (++pending) + ' pending');
            let {taskId, sourceId} = state;
            const message = 'Task #' + taskId + ' from Source #' + sourceId;

            const candidates: [Chan<any>, any][] = [];
            for (let jj = 0; jj < numWorkers; jj++) {
               candidates.push([workers[jj], [message + ' for ' + jj, retChan[0]]]);
            }

            go(async function (): Promise<number> {
               // console.log('On nested entry, ' + pending + ' pending');
               console.log('Preparing ' + message);
               await sleep(7500 + (2500 * Math.random()));
               const handle = await workerSemaphore;
               // console.log('Handle out: ' + handle);
               try {
                  // console.log('Sending ' + message);
                  const sent = await any(...candidates);
                  if (sent[0]) {
                     console.log('Sent ' + message + ' to ' + workers.indexOf(sent[1]) + ' using ' + handle);
                  } else {
                     console.log('Failed to send ' + message + ': ' + sent[0]);
                  }
               } finally {
                  // console.log('Handle in: ' + handle);
                  await put(workerSemaphore, handle);
               }
               const retVal: CLOSED|number = await retChan[0];
               if (typeof retVal === 'object') {
                  return -1;
               }
               await put(sourceSemaphore, retChan);
               return retVal;
            })
               .then((result: number) => {
                  console.log('Received reply of ' + result + ' to ' + message);
               })
               .catch(console.error);

            // console.log('On exit, ' + pending + ' pending');
            return (taskId < numTasks)
               ? {taskId: taskId + 1, sourceId}
               : false;
         }, {taskId: 1, sourceId: kk + 1}
      );
   }
});

// const slotsHeld: Slot[] = [];
// const repliesPending: (Chan<Pending>|Chan<number>)[] = [pending];
//
// repeat(
//    async function(nextCall: Pending, callsLeft: number) {
//
//       slotsHeld.push(nextCall[1]);
//       repliesPending.push(nextCall[0]);
//
//       return (callsLeft > 0) ? callsLeft - 1 : false;
//    }, numTasks - 1
// );


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

/*
console.log('Sleeping');
go(async function () {
   await sleep(10000);
});
*/

