import {map} from 'transducers-js';
import {AsyncSink} from 'ix/asyncsink';
import {chan, Chan, CLOSED, go, put, sleep} from 'medium';
import {IterableX} from 'ix/iterable';
import {AsyncIterableX} from 'ix/asynciterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/share';
import 'ix/add/asynciterable-operators/repeat';
import 'ix/add/asynciterable-operators/flatmap';
import 'ix/add/asynciterable-operators/mergeall';
import 'ix/add/asynciterable-operators/takeuntil';
import 'ix/add/asynciterable-operators/takewhile';
import 'ix/add/iterable-operators/share';
import 'ix/add/iterable/range';
// import {AutoIterate} from '../../infrastructure/lib';
import {asyncScheduler, SchedulerAction, SchedulerLike} from 'rxjs';
import {Nominal} from 'simplytyped';
import {IWatch, iWatch, Watch} from '@jchptf/api';

type TaskDef = Nominal<number, 'TaskDef'>;
type CanvasId = Nominal<number, 'CanvasId'>;
type Progress = Nominal<string, 'Progress'>;

// const autoIter = new AutoIterate(asyncScheduler);
const masterSequence = IterableX.range(1 as TaskDef, 5000 as TaskDef)
   .share();

class Source implements AsyncIterable<TaskDef>
{
   constructor(private readonly sourceId: number) { }

   async* [Symbol.asyncIterator](): AsyncIterableIterator<TaskDef>
   {
      let counter: number;
      for (counter of masterSequence) {
         // await new Promise(res => {
         //    setTimeout(res, Math.random() * 100)
         // });
         yield (
            this.sourceId + counter
         ) as TaskDef;
         await (
            sleep(Math.random() * 100)
         );
      }
   }
}

// class SourceSink<T> implements AsyncIterable<AsyncIterable<T>> {
//    private readonly sourceSink: AsyncSink<AsyncIterable<T>>;
//
//    public constructor() {
//       this.sourceSink = new AsyncSink<AsyncIterable<T>>();
//    }
//
//    public async * [Symbol.asyncIterator](): AsyncIterableIterator<AsyncIterable<T>>
//    {
//       let nextSource: AsyncIterable<T>;
//       for await (nextSource of this.sourceSink) {
//          yield nextSource;
//       }
//    }
//
//    public write(newSource: AsyncIterable<T>): void {
//       this.sourceSink.write(newSource);
//    }
// }


interface CanvasPoolSizes {
   readonly totalCount: number;
   readonly reserved: number;
   readonly free: number;
}

@iWatch()
class CanvasPool implements IWatch<CanvasPoolSizes>
{
   private channelOpen: boolean = true;
   private canvasPoolSizes: CanvasPoolSizes;
   private recentlyReturned: Array<CanvasManager> = [];

   constructor(
      private readonly availableCanvasQueue: AsyncSink<CanvasManager>,
      private readonly reserveCanvasChan: Chan<CanvasManager>
   )
   {
      this.canvasPoolSizes = {
         totalCount: 0,
         reserved: 0,
         free: 0
      };

      go(this.scanForRequests.bind(this))
         .then(() => {
            console.log('Process manager stopping');
         })
         .catch((err: any) => {
            console.error('Process manager error:', err);
         });

      go(this.scanForReturns.bind(this))
         .then(() => {
            console.log('Process manager stopping');
         })
         .catch((err: any) => {
            console.error('Process manager error:', err);
         });
   }

   public async scanForRequests(): Promise<void>
   {
      while (this.channelOpen) {
         const readyToReserve = this.recentlyReturned;
         this.recentlyReturned = [];
         for await (let nextCanvas of readyToReserve) {
            nextCanvas.reserve();
            if (await put(this.reserveCanvasChan, nextCanvas)) {
               const newCanvasPoolSizes = {
                  totalCount: this.canvasPoolSizes.totalCount,
                  reserved: this.canvasPoolSizes.reserved + 1,
                  free: this.canvasPoolSizes.free - 1
               };
               // this.recentlyReturned.slice(
               //    this.recentlyReturned.indexOf(nextCanvas), 1);
               this.notifyWatches(this.canvasPoolSizes, newCanvasPoolSizes);
               this.canvasPoolSizes = newCanvasPoolSizes;
            } else {
               console.error('Shutting down on closed channel.');
               this.channelOpen = false;
               break;
            }
         }
         await(
            sleep(10)
         );
      }
   }

   public async scanForReturns(): Promise<void> {
      while (this.channelOpen) {
         let inCount = 0;
         for await (let nextCanvas of this.availableCanvasQueue) {
            inCount++;
            this.recentlyReturned.push(nextCanvas);
         }

         if (inCount > 0) {
            const newCanvasPoolSizes = {
               totalCount: this.canvasPoolSizes.totalCount,
               reserved: this.canvasPoolSizes.reserved - inCount,
               free: this.canvasPoolSizes.free + inCount
            };
            this.notifyWatches(this.canvasPoolSizes, newCanvasPoolSizes);
            this.canvasPoolSizes = newCanvasPoolSizes;
         }

         await(
            sleep(10)
         );
      }
   }

   public register(newCanvas: CanvasId)
   {
      new CanvasManager(this.availableCanvasQueue, newCanvas);
      const newCanvasPoolSizes = {
         totalCount: this.canvasPoolSizes.totalCount + 1,
         reserved: this.canvasPoolSizes.reserved,
         free: this.canvasPoolSizes.free + 1
      };
      this.notifyWatches(this.canvasPoolSizes, newCanvasPoolSizes);
      this.canvasPoolSizes = newCanvasPoolSizes;
   }

   public addWatch(_id: string, _fn: Watch<CanvasPoolSizes>): boolean
   {
      return false;
   }

   public notifyWatches(_oldState: CanvasPoolSizes, _newState: CanvasPoolSizes): void
   {
   }

   public removeWatch(_id: string): boolean
   {
      return false;
   }
}

class ProcessManager
{
   private channelOpen: boolean;

   constructor(
      private readonly submitChan: Chan<any, TaskDef>,
      private readonly reserveCanvasChan: Chan<any, CanvasManager>,
      private readonly paintRequestSink: AsyncSink<CanvasPaintTask>,
      private readonly storeRequestSink: AsyncSink<CanvasStoreTask>
   ) {
      this.channelOpen = true
   }

   public start(): void
   {
      for (let ii = 0; ii < 2; ii++) {
         go(this.runThread.bind(this))
            .then(() => {
               console.log('Process manager stopping');
               this.channelOpen = false;
            })
            .catch((err: any) => {
               console.error('Process manager error:', err);
               this.channelOpen = false;
            })
      }
   }

   private async runThread(): Promise<void>
   {
      console.log('Running process manager thread');
      while (this.channelOpen) {
         const canvasManager: (CanvasManager|CLOSED) = await this.reserveCanvasChan;

         if (canvasManager instanceof CanvasManager) {
            // TODO
            const canvasId: CanvasId = canvasManager.getReservation() as CanvasId;

            try {
               const nextTask: TaskDef | CLOSED = await this.submitChan;
               console.log('Took:', nextTask, 'on', canvasId);

               if (! isClosed(nextTask)) {
                  const onPainted: Chan<Progress, number> =
                     chan(undefined, map((progress: Progress) => progress.length));
                  const paintTask =
                     new CanvasPaintTask(canvasId, nextTask, onPainted);
                  this.paintRequestSink.write(paintTask);
                  console.log('Paint length: ' + await onPainted);

                  const onStored: Chan<number> = chan();
                  const storeTask =
                     new CanvasStoreTask(canvasId, nextTask, onStored);
                  this.storeRequestSink.write(storeTask);
                  console.log('Stored to: ' + await onStored);
               } else {
                  console.log('Shutting down on close of input channel');
                  this.channelOpen= false;
                  break;
               }
            } catch (err) {
               console.error(err);
            } finally {
               console.log('Releasing canvas to other lessees');
               canvasManager.release();
            }
         } else {
            console.log('Shutting down on close of input channel');
            this.channelOpen= false;
            break;
         }
      }
   }
}

class CanvasPaintTask implements Iterable<Progress>
{
   constructor(
      private readonly canvasId: CanvasId,
      private readonly sourceId: TaskDef,
      private readonly onReturn: Chan<Progress, any>
   )
   {
      console.log('Created task for ' + this.sourceId + ' on ' + this.canvasId);
   }

   * [Symbol.iterator](): Iterator<Progress>
   {
      const iterCount = 2 + (8 * Math.random());
      console.log(`Began iteration loop of ${iterCount} for ${this.sourceId} on ${this.canvasId}`);
      let sum = 0;
      let progress: Progress;
      for (let ii = 0; ii < iterCount; ii++) {
         let boundary = 500000 + (
            Math.random() * 250000
         );
         progress = `loop ${ii} of ${boundary} for ${this.sourceId} on ${this.canvasId} after ${sum}` as Progress;
         yield progress;

         sum = 0;
         let sense = 2 * (
            0.5 - Math.random()
         );
         for (let jj = 0; jj < boundary; jj++) {
            sum += sense * jj;
            sense = (
               (
                  sense > 0
               ) ? -1 : 1
            ) * Math.random();
         }
      }

      console.log(`Ended iteration loop of ${iterCount} for ${this.sourceId} on ${this.canvasId}`);
      progress = `${sum} on ${this.canvasId} for ${this.sourceId}` as Progress;

      put(this.onReturn, progress)
         .then(
            (value: boolean) => { console.log('on Return: ' + value);}
         )
         .catch(
            (err: any) => {console.error('Failed to respond:', err);}
         );
   }
}

class CanvasStoreTask
{
   constructor(
      public readonly canvasId: CanvasId,
      public readonly sourceId: TaskDef,
      private readonly onReturn: Chan<number, any>
   )
   {
      console.log('Created storage task for ' + this.sourceId + ' on ' + this.canvasId);
   }

   async save(): Promise<void>
   {
      console.log('Saving...');
      await sleep(250);
      // console.log('Responding...');
      await put(this.onReturn, this.canvasId);
      console.log('Saved...')
   }
}


class CanvasManager
{
   private reserved: boolean;

   constructor(
      private readonly availableSink: AsyncSink<CanvasManager>, private readonly canvasId: CanvasId)
   {
      console.log('Created canvas manager ' + this.canvasId);
      this.reserved = false;
      this.availableSink.write(this);
   }

   public reserve(): CanvasId
   {
      if (this.reserved) {
         throw new Error('Not available!');
      }
      this.reserved = true;

      return this.canvasId;
   }

   public release(): void
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      this.reserved = false;
      this.availableSink.write(this);
   }

   public getReservation(): CanvasId|false
   {
      return this.reserved ? this.canvasId : false;
   }
}

class CanvasPainter
{
   private readonly paintResumeQueue: AsyncSink<AsyncIterableX<Iterator<Progress>>>;

   private readonly paintWorkQueue: AsyncIterableX<Iterator<Progress>>;

   private readonly paintRepeatSource: AsyncIterableX<Iterator<Progress>>;

   private readonly pendingPaintIterators: Array<Iterator<Progress>>;

   constructor(
      private readonly newPaintTaskQueue: AsyncSink<CanvasPaintTask>,
      private readonly scheduler: SchedulerLike,
      private readonly pulseInterval: number,
      private readonly paintDuration: number)
   {
      if (this.paintDuration > this.pulseInterval) {
         throw new Error('pulse interval must be at least as great as paint duration');
      }

      this.paintResumeQueue =
         new AsyncSink<AsyncIterableX<Iterator<Progress>>>();

      this.paintWorkQueue =
         AsyncIterableX.from(this.paintResumeQueue)
            .mergeAll();

      this.pendingPaintIterators = [];

      this.paintRepeatSource =
         AsyncIterableX.from(this.pendingPaintIterators);
            // .repeat();
   }

   start(): void
   {
      go(this.monitorInboundQueue.bind(this))
         .then(console.log.bind(console))
         .catch(console.error.bind(console));

      go(this.doPaintWork.bind(this))
         .then(console.log.bind(console))
         .catch(console.error.bind(console));

      const repeatSource = this.paintRepeatSource;
      const pulseDelay = this.pulseInterval - this.paintDuration;
      const paintDuration = this.paintDuration;
      const pendingPaintIterators = this.pendingPaintIterators;

      this.scheduler.schedule(
         function (
            this: SchedulerAction<AsyncSink<AsyncIterableX<Iterator<Progress>>>>,
            state?: AsyncSink<AsyncIterableX<Iterator<Progress>>>): void
         {
            const self: SchedulerAction<AsyncSink<AsyncIterableX<Iterator<Progress>>>> = this;

            if (!!state) {
               console.log('Scheduler waking...');

               state.write(
                  repeatSource.takeUntil(function () {
                     return new Promise((resolve) => {
                        setTimeout(
                           () => {
                              self.schedule(state!, pulseDelay);
                              resolve();
                           }, paintDuration);
                     });
                  }).takeWhile((value: Iterator<Progress>) => {
                     return !((value === undefined) || (pendingPaintIterators.length === 0));
                  })

               )
            } else {
               console.error('No Scheduler Queue!?');
            }
         }, this.pulseInterval, this.paintResumeQueue);
   }

   private async monitorInboundQueue(): Promise<void>
   {
      console.log('Monitoring for paint tasks...');

      for await (const task of this.newPaintTaskQueue) {
         this.pendingPaintIterators.push(
            task[Symbol.iterator]()
         );
      }
   }

   private async doPaintWork(): Promise<void>
   {
      console.log('Monitoring for painting step tasks...');

      let nextIterator: Iterator<Progress>;
      for await (nextIterator of this.paintWorkQueue) {
         const nextResult = nextIterator.next();
         if (nextResult.done) {
            this.pendingPaintIterators.splice(
               this.pendingPaintIterators.indexOf(nextIterator), 1
            )
         } else {
            console.log(nextResult.value);
         }
      }
   }
}

class CanvasWriter
{
   constructor(private readonly newStoreTaskQueue: AsyncSink<CanvasStoreTask>) { }

   start(): void
   {
      go(this.monitorInboundQueue.bind(this))
         .then(console.log.bind(console))
         .catch(console.error.bind(console));
   }

   private async monitorInboundQueue(): Promise<void>
   {
      console.log('Monitoring for write tasks...');

      for await (const task of this.newStoreTaskQueue) {
         await task.save();
         console.log(`Saved content from ${task.canvasId} of ${task.sourceId}`);
      }
   }
}


const sourceSink: AsyncSink<AsyncIterable<TaskDef>> =
   new AsyncSink<AsyncIterable<TaskDef>>();

sourceSink.write(
   AsyncIterableX.from(
      new Source(10000))
);
sourceSink.write(
   AsyncIterableX.from(
      new Source(30000))
);
sourceSink.write(
   AsyncIterableX.from(
      new Source(50000))
);

const sources: AsyncIterableX<number> =
   // AsyncIterableX.from(sourceSink)
   AsyncIterableX.from(
      sourceSink[Symbol.asyncIterator]()
   )
      .mergeAll()
      .share();

const submitTask: Chan<TaskDef> =
   chan<TaskDef>();
const reserveCanvasChan: Chan<CanvasManager> =
   chan<CanvasManager>();
const availableCanvasQueue: AsyncSink<CanvasManager> =
   new AsyncSink<CanvasManager>();
const newPaintTaskQueue: AsyncSink<CanvasPaintTask> =
   new AsyncSink <CanvasPaintTask>();
const newStoreTaskQueue: AsyncSink<CanvasStoreTask> =
   new AsyncSink<CanvasStoreTask>();

const canvasPool =
   new CanvasPool(availableCanvasQueue, reserveCanvasChan);
const processMgr =
   new ProcessManager(submitTask, reserveCanvasChan, newPaintTaskQueue, newStoreTaskQueue);
const canvasPainter =
   new CanvasPainter(newPaintTaskQueue, asyncScheduler, 250, 100);
const canvasWriter =
   new CanvasWriter(newStoreTaskQueue);

processMgr.start();
canvasPainter.start();
canvasWriter.start();
canvasPool.register(88 as CanvasId);
canvasPool.register(75 as CanvasId);
canvasPool.register(39 as CanvasId);
canvasPool.register(101 as CanvasId);

for (let ii = 0; ii < 4; ii++) {
   go(async function () {
      const id = ii;
      console.log('Begin reader', id);
      for await (const taskDef of sources) {
         // console.log('Feeding...');
         await put(submitTask, taskDef);
      }
      console.log('Finish reader', id);
   })
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
}

/*
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
*/

export function isClosed(chanVal: CanvasManager | CLOSED): chanVal is CLOSED
{
   return chanVal === CLOSED;
}