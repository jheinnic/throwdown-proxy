import {chan, sleep, go, any, Chan, CLOSED} from 'medium'

const workers: any[] = [];
const gone: Promise<any>[] = [];
const numWorkers = 4;
const numTasks = 50;

for (let ii = 0; ii < numWorkers; ii++ ) {
    // const thisChan: Chan<string> = chan(5 + ii * 15);
    const thisChan: Chan<string> = chan(0);
    gone.push(
       go(async function() {
          const identity = ii;
          while (true) {
             await sleep(75 + identity * 60);
             const message: CLOSED|string = await thisChan;
             console.log("Worker " + identity + " reads " + message);
             await sleep(75 + identity * 60);
          }
       })
    );

    workers.push(thisChan);
}

go(async function() {
   for(let ii = 0; ii < numTasks; ii++ ) {
      const message = 'Task #' + (
         ii + 1
      );
      console.log('Sending ' + message);
      const candidates: [Chan<string>, string][] = [];
      for (let jj = 0; jj < numTasks; jj++) {
         candidates.push([workers[jj], message + ' for ' + jj]);
      }

      await any(candidates[0], candidates[1], candidates[2], candidates[3]);
   }

   return 'Fin';
}).then((value: void) => {
   console.log('Outer loop', value);
}).catch((err: any) => {
   console.error(err);
});

Promise.all(gone).then(
   (value: any[]) => { console.log('Worker loop', value); }
).catch(
   (err: any) => { console.error(err); }
);

