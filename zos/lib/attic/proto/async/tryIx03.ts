import {AsyncSink} from 'ix/asyncsink';
import {go, sleep} from 'medium';
import {IterableX} from 'ix/iterable';
import {AsyncIterableX} from 'ix/asynciterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/iterable/range';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/flatmap';
import 'ix/add/asynciterable-operators/share';
import 'ix/add/iterable-operators/share';
import 'ix/add/asynciterable/asyncify';
import {AutoIterate} from '../../../../src/infrastructure/lib';
import {asyncScheduler} from 'rxjs';

const autoIter = new AutoIterate(asyncScheduler);
const masterSequence = IterableX.range(1, 5000).share();

function makeSource(sourceId: number)
{
   async function* readFiles(): AsyncIterableIterator<number>
   {
      for (let counter of masterSequence) {
         await(sleep(Math.random() * 100));
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
   ).share();

class CanvasTask implements Iterable<string> {
   constructor( private readonly canvasId: number, private readonly sourceId: number ) {
      console.log('Created task for ' + this.sourceId + ' on ' + this.canvasId);
   }

   public * [Symbol.iterator](): Iterator<string>
   {
      const iterCount = 2 + (8 * Math.random());
      console.log(`Began iteration loop of ${iterCount} for ${this.sourceId} on ${this.canvasId}`);
      let sum = 0;
      for (let ii = 0; ii < iterCount; ii++ ) {
         let boundary = 100000000 + (Math.random() * 100000000);
         yield `loop ${ii} of ${boundary} for ${this.sourceId} on ${this.canvasId} after ${sum}`;
         sum = 0;
         let sense = 2 * (0.5 - Math.random());
         for (let jj = 0; jj < boundary; jj++ ) {
            sum += sense * jj;
            sense = ((sense > 0) ? -1 : 1) * Math.random();
         }

         // console.log(`${sum} on ${this.canvasId} for ${this.sourceId}`);
      }
      console.log(`Ended iteration loop of ${iterCount} for ${this.sourceId} on ${this.canvasId}`);
   }
}


class CanvasManager implements AsyncIterable<CanvasTask>
{
   constructor(private readonly canvasId: number, private readonly sources: AsyncIterableX<number>)
   {
      console.log('Created canvas manager ' + this.canvasId);
   }

   public [Symbol.asyncIterator](): AsyncIterator<CanvasTask>
   {
      return this.sources.map<number, CanvasTask>(
         async (value: number) => {
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
   AsyncIterableX.from(_w4)
);

for (let ii = 0; ii < 3; ii++) {
   go(async function () {
      let nextTask: CanvasTask;
      for await (nextTask of _wIncoming) {
         let taskSink: AsyncSink<string> = new AsyncSink<string>();
         autoIter.run(nextTask, taskSink, 10);
         for await (let step of taskSink) {
            console.log('step: ' + step);
         }
         console.log('No more steps');
      }
      console.error('No more work?');
   })
      .then(
         function () {
            console.log('Exit from feeder loop #' + ii);
         }
      )
      .catch(
         function (err: any) {
            console.error(`Exit from feeder loop ${ii} with error:`, err);
         }
      );
}
