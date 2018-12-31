import {any, go, chan, Chan, put, repeatTake, sleep} from 'medium'
import {Nominal} from 'simplytyped';

const numWorkers = 4;
const numSources = 1;
const numTasks = 30;
const MAX_SLOTS = 10;

const workers: any[] = [];
const workerSemaphore: Chan<number> = chan(MAX_SLOTS);

for (let ii = 0; ii < numWorkers; ii++) {
   const identity = ii;
   const thisChan: Chan<[string, Chan<number>]> = chan();
   workers.push(thisChan);
   put(workerSemaphore, identity);

   repeatTake(thisChan, async function (message: [string, Chan<number>], _acc) {
      console.log('Worker ' + identity + ' reads ' + message[0]);
      await sleep(300 + (Math.random() * 400));
      console.log('Worker ' + identity + ' replied to ' + message[0]);
      await put(message[1], ii);

      return identity;
   }, identity);
}

type Slot = Nominal<number, 'SemaphoreSlot'>;
const sourceSemaphore: Chan<Slot> = chan(MAX_SLOTS);
let pending = 0;

for (let kk = 0; kk < numSources; kk++) {
   repeatTake(
      sourceSemaphore,
      async function (slot, state) {
         // console.log('On entry, ' + (++pending) + ' pending');
         let {taskId, sourceId} = state;
         const message = 'Task #' + taskId + ' from Source #' + sourceId;
         // console.log('Preparing ' + message);
         // await sleep();

         go(async function () {
            // console.log('On nested entry, ' + pending + ' pending');
            const retChan = chan();
            const candidates: [Chan<any>, any][] = [];
            for (let jj = 0; jj < numWorkers; jj++) {
              candidates.push([workers[jj], [message + ' for ' + jj, retChan]]);
            }

            const handle = await workerSemaphore;
            console.log('Handle out: ' + handle);
            try {
               // console.log('Sending ' + message);
               const sent = await any(...candidates);
               if (sent[0]) {
                  console.log('Sent ' + message + ' to ' + workers.indexOf(sent[1]) + ': ' + sent[0]);
               } else {
                  console.log('Failed to send ' + message + ': ' + sent[0]);
               }
            } finally {
               console.log('Handle in: ' + handle);
               await put(workerSemaphore, handle);
            }
            const retVal = await retChan;
            await put(sourceSemaphore, slot);
            return retVal;
         }).then((result: number) => {
            console.log('Received reply of ' + result + ' to ' + message);
         }).catch(console.error);

         // console.log('On exit, ' + pending + ' pending');
         return (taskId < numTasks) ? { taskId: taskId + 1, sourceId } : false;
      }, {taskId: 1, sourceId: kk+1}
   );
}

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

go(async function () {
   await sleep(10000);
});

put(sourceSemaphore, 1);
put(sourceSemaphore, 2);
put(sourceSemaphore, 3);
put(sourceSemaphore, 4);
put(sourceSemaphore, 5);
// put(sourceSemaphore, 6);
// put(sourceSemaphore, 7);
// put(sourceSemaphore, 8);
// put(sourceSemaphore, 9);
// put(sourceSemaphore, 10);

