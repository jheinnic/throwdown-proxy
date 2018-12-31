import Queue from 'co-priority-queue';
import {co} from 'co';
import chan from 'chan';

const numWorkers = 4;
const numTasks = 40;

type Worker = (message: string) => Promise<number>;
const workers: Queue<Worker> = new Queue<Worker>();
const sourceFeed: Chan.Chan<string> = chan();

function sleep(time: number): Promise<void>
{
   return new Promise((resolve) => {
      setTimeout(resolve, time);
   });
}

console.log('Spawning workers');
let pending = 0;
const doWork =
   co.wrap(function* (identity: number, message: string) {
      yield sleep(250 * Math.random());
      console.log('Worker ' + identity + ' replied to ' + message);
      console.log('Out Pending count: ' + (pending--));
      return identity;
   });

for (let ii = 0; ii < numWorkers; ii++) {
   const identity = ii;
   const nextWorker = function (message: string): Promise<number> {
      return doWork(identity, message)
         .then(
            (value: number) => {
               workers.push(nextWorker, 10);
               return value;
            }
         );
   };

   workers.push(nextWorker, 10);
}

// Allow up to 16 messages to be in-transit at a time.
// Take one second to prepare each message (load time), then wait for an available worker.
// Worker will take an additional 250 ms.
const submitMessage =
   co.wrap(
      function* (message: string): IterableIterator<any> {
         console.log('Loading ' + message);
         yield sleep(2000 * Math.random());
         const worker: Worker = yield workers.next();
         return yield worker(message);
      }
   );

function* iterateSource(sourceId: number, taskCount: number): IterableIterator<string>
{
   for (let taskId = 1; taskId <= taskCount; taskId++) {
      yield 'Task #' + taskId + ' from Source #' + sourceId;
   }
}

const openSource = co.wrap(
   function* (sourceFeed: Chan.Chan<string>, sourceId: number, taskCount: number) {
      for (let message of iterateSource(sourceId, taskCount)) {
         yield sourceFeed(message);
      }
   }
);

const loadFromSource =
   co.wrap(
      function* (sourceFeed: Chan.Chan<string>) {
         while (true) {
            yield sleep(250 * Math.random());
            const message = yield sourceFeed;
            console.log('Pending count: ' + (++pending));
            const workerId = yield submitMessage(message);
            console.log('Completed ' + message + ' on Worker #' + workerId);
         }
      }
   );

openSource(sourceFeed, 1, numTasks);
openSource(sourceFeed, 2, numTasks);

loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
loadFromSource(sourceFeed);
