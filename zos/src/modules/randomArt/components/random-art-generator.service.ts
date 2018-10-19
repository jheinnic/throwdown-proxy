import {Subscription} from 'rxjs';
import {Injectable, Input} from '@angular/core';
import {Chan} from 'medium';
import {Chanel} from 'chanel';
import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {co} from 'co';
import {IEnable} from '@jchptf/api';

import {IRandomArtGenerator} from '../interfaces';
import {
   CanvasAvailableMessage, InputTaskMessage, LifecycleStopMessage, PaintEngineTaskMessage,
   WriteOutputTaskMessage
} from '../messages';
import '../../../infrastructure/reflection';
import {Queue} from 'co-priority-queue';
import {limiter} from '@jchptf/co-limit';
import {interfaces} from 'inversify';
import Factory = interfaces.Factory;

@Injectable()
@IEnable
export class RandomArtGenerator implements IRandomArtGenerator
{
   private stopRequested: boolean = false;

   // private readonly canvasSource: AsyncIterable<Canvas>;
   private canvasMetadata: Map<Canvas, CanvasMetadata> = new Map<Canvas, CanvasMetadata>();

   private deferredByImagePolicy: Map<string, Queue<DeferredQueues>> =
      new Map<string, Queue<InputTaskMessage>>();

   private deferredTasksByRenderPolicy: Map<string, Queue<InputTaskMessage>> =
      new Map<string, Queue<InputTaskMessage>>();

   private startStopMonitor: () => Promise<void>;

   private startCanvasMonitor: () => Promise<void>;

   private startNewTaskMonitor: () => Promise<void>;

   constructor(
      private readonly taskLoader: Queue<InputTaskMessage>,
      private readonly taskQueueFactory: Factory<Queue<InputTaskMessage>>,
      private readonly paintingChannel: Chanel<PaintEngineTaskMessage>,
      private readonly outputChannel: Chanel<WriteOutputTaskMessage>,
      private readonly canvasReturn: Queue<CanvasAvailableMessage>,
      private readonly stopSignal: Queue<LifecycleStopMessage>)
   {
      const launchLimiter = limiter(3);

      // @ts-ignore
      this.startStopMonitor    = launchLimiter(this.monitorForStopSignal.bind(this), 10);

      // @ts-ignore
      this.startCanvasMonitor = launchLimiter(this.monitorCanvasQueue.bind(this), 10);
      // @ts-ignore
      this.startNewTaskMonitor = launchLimiter(this.monitorNewTaskQueue.bind(this), 10);
   }

   start() {
      // co(this.monitorForStopSignal.bind(this));
      this.startStopMonitor();
      this.startCanvasMonitor();
      this.startNewTaskMonitor();
   }

   private* monitorForStopSignal(): IterableIterator<unknown>
   {
      while(! this.stopRequested) {
         const stop: LifecycleStopMessage = yield this.stopSignal.next();
         if (!!stop) {
            this.stopRequested = true;
         }
      }
   }

   private* monitorCanvasQueue(): IterableIterator<unknown>
   {
      while(! this.stopRequested) {
         const available: Canvas = yield this.canvasReturn.next();
      }
   }

   private* monitorTaskQueue(): IterableIterator<unknown>
   {
      while(! this.stopRequested) {
         const available: CanvasAvailableMessage = yield this.canvasReturn.next();
         const canvas: Canvas = available.canvas;
         const metadata: CanvasMetadata = this.canvasMetadata.get(canvas);
         if (!! metadata.supports) {
            // Supports references are kept in descending priority order.
            const match = metadata.supports.find((value) => {
               if (this.pendingTasks.has(value.name)) {
                  const pendingTaskQueue: InputTaskMessage[] =
                     this.pendingTasks.get(value.name);
                  if (pendingTaskQueue.length > 0) {
                     // TODO: Pop input Queue
                     // TODO: Launch Paint coroutine
                     // TODO: Push paint Queue
                     return true;
                  }
               }

               return false;
            })
         }
      }
   }

   private* manageRandomArtTask(): IterableIterator<unknown>
   {

   }

   private* loadRandomArtModelTask(): IterableIterator<unknown>
   {

   }

   private* paintRandomArtImageTask(): IterableIterator<unknown>
   {

   }

   private* writeRandomArtOutputTask(): IterableIterator<unknown>
   {

   }

   public launchCanvas()
   {
      console.log('In launch canvas()');

      let subscription: Subscription;
      const abortSubscription = timer(5000)
         .pipe(
            delayWhen(of, this.stopObservable))
         .subscribe(
            () => { subscription.unsubscribe(); },
            (error: any) => { console.error(error); },
            () => { console.log('Abort watcher completes'); });

      subscription = this.canvasSource.pipe(
         // .delayWhen(
         //   Observable.of, this.loopObservable
         // )
         tap(
            (freeCanvas: Canvas) => {console.log('Source was triggered for ', freeCanvas); }
         ),
         this.taskLoader.assignNextTask(),
         this.painter.paintThenEmit(),
         this.canvasWriter.writeOutputFile(),

         tap((post: any) => { console.log('Pre-repeat: ', post); }),
         repeatWhen(
            takeUntil(this.stopObservable)
         ),
         tap((post: any) => { console.log('Post-concat: ', post); }))
      // .multicast(() => this.loopSignal) // .refCount()
         .subscribe(
            () => {
               console.log('Observed recycling of canvas on completion of a painting task');
            },
            (error: any) => { console.error(error); },
            () => { abortSubscription.unsubscribe(); }
         );
   }

   public shutdownCanvas()
   {
      this.stopSignal.next(undefined);
   }
}

enum CanvasSupportRole {
   FULL = 'full',
   PREVIEW = 'preview',
   THUMBNAIL = 'thumbnail'
}

interface ImagePolicySupport {
   readonly name: string;
   readonly role: CanvasSupportRole;
}

class CanvasMetadata {
   constructor(
      public readonly canvas: Canvas,
      public readonly context: MyCanvasRenderingContext2D,
      public readonly supports: ImagePolicySupport)
   { }
}

interface DeferredQueues {
   pendingTasks: Queue<InputTaskMessage>;
   canvasWorkers: Queue<CanvasAvailableMessage>;
}