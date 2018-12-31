import {sleep} from 'medium';
import {IterableX} from 'ix/iterable';
import {AsyncIterableX} from 'ix/asynciterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/iterable/range';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
import {delay} from 'ix/asynciterable/delay';
import 'ix/add/asynciterable-operators/flatmap';
import 'ix/add/asynciterable-operators/share';
import 'ix/add/iterable-operators/share';
import 'ix/add/asynciterable/asyncify';

/*
const pipeline: AsyncSink<string> = new AsyncSink<string>();
const pipelineFeed = pipeline.share();

go(async function () {
   for await (let result of pipeline) {
      console.log('Result: ', result);
   }
})
   .then(function () {
      console.log('Exit from main loop');
   })
   .catch(function (err: any) {
      console.error('Exit from main loop with error:', err);
   });

go(async function () {
   for await (let result of pipeline) {
      console.log('Result: ', result);
   }
})
   .then(function () {
      console.log('Exit from main loop');
   })
   .catch(function (err: any) {
      console.error('Exit from main loop with error:', err);
   });
*/

const masterSequence = IterableX.range(1, 5000).share();

function makeSource(sourceId: number)
{
   async function* readFiles(): AsyncIterableIterator<number>
   {
      for (let counter of masterSequence) {
         console.log('Sleeping...');
         await(sleep(Math.random() * 1000));
         console.log('Yielding ' + counter);
         yield sourceId + counter;
      }
   }

   return readFiles;
}

const sources: AsyncIterableX<number> =
   AsyncIterableX.merge(
      AsyncIterableX.create(makeSource(10000)),
      AsyncIterableX.create(makeSource(20000)),
      AsyncIterableX.create(makeSource(50000))
   )
   .share();

class CanvasTask implements Iterable<string> {
   constructor( private readonly canvasId: number, private readonly sourceId: number ) {
      console.log('Created task for ' + this.sourceId + ' on ' + this.canvasId);
   }

   public * [Symbol.iterator](): Iterator<string>
   {
      console.log('Began iteration loop for ' + this.sourceId + ' on ' + this.canvasId);
      const iterCount = 2 + (8 * Math.random());
      for (let ii = 0; ii < iterCount; ii++ ) {
         let boundary = 100000000 + (Math.random() * 100000000);
         yield `loop ${ii} of ${boundary} for ${this.sourceId} on ${this.canvasId}`;
         let sum = 0;
         let sense = 2 * (0.5 - Math.random());
         for (let jj = 0; jj < boundary; jj++ ) {
            sum += sense * jj;
            sense = ((sense > 0) ? -1 : 1) * Math.random();
         }

         // pipeline.write(`${sum} from ${boundary} on ${this.canvasId} for ${this.sourceId}`);
      }
   }
}


class CanvasManager implements AsyncIterable<CanvasTask>
{
   constructor(private readonly canvasId: number, private readonly sources: AsyncIterableX<number>)
   {
      console.log('Created canvas manager ' + this.canvasId);
   }

   // async doWork(task: number): Promise<void>
   // {
   //    console.log('Begin ' + task + ' on worker ' + this.workerId);
   //    await sleep(Math.random() * 500);
   //    console.log('Finish ' + task + ' on worker ' + this.workerId);
   // }

   public [Symbol.asyncIterator](): AsyncIterator<CanvasTask>
   {
      console.log('Begin iteration through ' + this.canvasId);
      return this.sources.map<number, CanvasTask>(
         async (value: number) => {
            console.log('Creating task for ' + value + ' on canvas ' + this.canvasId);
            return new CanvasTask(this.canvasId, value);
         }
      )[Symbol.asyncIterator]();
   }
}

const _w1: CanvasManager = new CanvasManager(1, sources);
const _w2: CanvasManager = new CanvasManager(2, sources);
const _w3: CanvasManager = new CanvasManager(3, sources);
const _w4: CanvasManager = new CanvasManager(4, sources);

const _wIncoming = AsyncIterableX.merge(
   AsyncIterableX.from(_w1),
   AsyncIterableX.from(_w2),
   AsyncIterableX.from(_w3),
   AsyncIterableX.from(_w4),
).share();

AsyncIterableX.merge(
   _wIncoming.flatMap(
      (task: CanvasTask) => {
         console.log('AAA');
         return delay(AsyncIterableX.from(task), 1)
      }
   ),
   _wIncoming.flatMap(
      (task: CanvasTask) => {
         console.log('BBB');
         return delay(AsyncIterableX.from(task), 1)
      }
   )
).forEach((value: string) => {
   console.log('Next iteration on ' + value);
}).then(
   () => {
      console.log('Main task termination');
   }
).catch(
   (err: any) => {
      console.error('Main task failure:', err);
   }
);

