import {injectable} from 'inversify';
import {Chanel} from 'chanel';
import {Queue} from 'co-priority-queue';
import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import * as util from 'util';
// import {IEnable} from '@jchptf/api';
import {limiter} from '@jchptf/co-limit';

import {IncrementalPlotterFactory, IRandomArtGenerator} from '../../interface/index';
import {
   CanvasAvailableMessage, CanvasDimensions, DeferrableMessage, AssignCanvasRequest, LifecycleStopMessage,
   PaintEngineTaskMessage, WriteOutputTaskMessage
} from '../../messages/index';
import {ImageStylePolicy, RandomArtPlayAssets, RenderingPolicy} from '../../../tickets/config/index';
import {QueueFactory} from '../../../infrastructure/coroutines/di';
import '../../../../infrastructure/reflection/index';
import {Chan} from 'chan';

@injectable()
export class RandomArtGenerator<P extends string, R extends string> implements IRandomArtGenerator
{
   private stopRequested: boolean = false;

   // private readonly canvasSource: AsyncIterable<Canvas>;
   private canvasMetadata: Map<Canvas, CanvasMetadata<P, R>> = new Map<Canvas, CanvasMetadata<P, R>>();

   private supportByPolicyAndRole: Map<string, Queue<DeferrableMessage>> =
      new Map<string, Queue<DeferrableMessage>>();

   // private deferredTasksByRenderPolicy: Map<string, Queue<DeferrableMessage>> =
   //    new Map<string, Queue<DeferrableMessage>>();

   private startStopMonitor: () => Promise<void>;

   private startCanvasMonitor: () => Promise<void>;

   private startNewTaskMonitor: () => Promise<void>;

   constructor(
      private readonly taskLoader: Chan<AssignCanvasRequest<P, R>>,
      private readonly canvasReturn: Queue<CanvasAvailableMessage>,
      private readonly stopSignal: Queue<LifecycleStopMessage>,
      private readonly deferredQueueFactory: QueueFactory<DeferrableMessage>,
      private readonly plotFactories: Map<P, Map<R, IncrementalPlotterFactory>>,
      private readonly paintingChannel: Chanel<PaintEngineTaskMessage<P, R>>,
      private readonly outputChannel: Chanel<WriteOutputTaskMessage<P, R>>)
   {
      const launchLimiter = limiter(3);

      // @ts-ignore
      this.startStopMonitor = launchLimiter(this.monitorForStopSignal.bind(this), 10);

      // @ts-ignore
      this.startCanvasMonitor = launchLimiter(this.monitorCanvasQueue.bind(this), 10);

      // @ts-ignore
      this.startNewTaskMonitor = launchLimiter(this.monitorNewTaskQueue.bind(this), 10);

      plotFactories.forEach((innerMap: Map<R, IncrementalPlotterFactory>, policy: P) => {
         innerMap.forEach((plotterFactory: IncrementalPlotterFactory, role: R) => {
            const supportKey: ImagePolicySupport<P, R> =
               new ImagePolicySupport<P, R>(
                  policy, role, plotterFactory, this.deferredQueueFactory()
               );
            this.supportByPolicyAndRole.set(supportKey.toString(), this.deferredQueueFactory());
         });
      });

      //    const imagePoliciesByName: Map<string, ImageFieldPolicy> =
      //    new Map<string, ImageFieldPolicy>();
      // let imagePolicy: ImageFieldPolicy;
      // for (imagePolicy of this.playAssetsCfg.imagePolicies) {
      //    imagePoliciesByName.set(imagePolicy.name, imagePolicy);
      //    this.deferredBySuportKey.set(imagePolicy.name, this.deferredQueueFactory());
      // }
      //
      // const renderPoliciesByName: Map<string, RenderingPolicy> =
      //    new Map<string, RenderingPolicy>();
      // let renderPolicy: RenderingPolicy;
      // for (renderPolicy of this.playAssetsCfg.renderPolicies) {
      //    renderPoliciesByName.set(renderPolicy.name, renderPolicy);
      // }
   }

   start() {
      // co(this.monitorForStopSignal.bind(this));
      ack(this.startStopMonitor(), 'stopMonitor');
      ack(this.startCanvasMonitor(), 'canvasMonitor');
      ack(this.startNewTaskMonitor(), 'newTaskMonitor');
   }

   private* monitorForStopSignal(): IterableIterator<unknown>
   {
      while(!! (yield this.stopSignal.next())) { }
      this.stopRequested = true;
   }

   private* monitorCanvasQueue(): IterableIterator<unknown>
   {
      while(! this.stopRequested) {
         const available: CanvasAvailableMessage = yield this.canvasReturn.next();
         const canvas: Canvas = available.canvas;
         const metadata?: CanvasMetadata<P,R> = this.canvasMetadata.get(canvas);

         if ((!!metadata) && (!! metadata.supports)) {
            // Supports references are kept in descending priority order.
            const deferredTask: DeferrableMessage =
               yield metadata.supports.deferredQueue.next();
            const match = metadata.supports.find((value) => {
               if (this.pendingTasks.has(value.name)) {
                  const pendingTaskQueue: AssignCanvasRequest[] =
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

   private* monitorNewTaskQueue(): IterableIterator<unknown>
   {
      while(! this.stopRequested) {
         const newTask: AssignCanvasRequest<P, R> = yield this.taskLoader.next();
         const renderPolicyName: P = newTask.taskIdentity.renderPolicy;
         const renderRoleName: R = newTask.taskIdentity.renderRoleName;
         const supportKey = ImagePolicySupport.toString(renderPolicyName, renderRoleName);
         const supportObj = this.supportByPolicyAndRole.get(supportKey);

         if (!! supportObj) {
            // Supports references are kept in descending priority order.
            const match = metadata.supports.find((value) => {
               if (this.pendingTasks.has(value.name)) {
                  const pendingTaskQueue: AssignCanvasRequest[] =
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

   private* monitorDeferredQueue(deferred: Queue<DeferrableMessage>): IterableIterator<unknown>
   {
      while(! this.stopRequested) {

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

   private static readonly STOP_FLYWEIGHT = new LifecycleStopMessage();

   public stop(): void
   {
      this.stopSignal.push(RandomArtGenerator.STOP_FLYWEIGHT, 0);
   }
}


class ImagePolicySupport<P extends string, R extends string> {
   constructor(
      public readonly policy: P,
      public readonly role: R,
      public readonly dimensions: CanvasDimensions,
      readonly plotFactory: IncrementalPlotterFactory,
      readonly inputQueue: Chan<AssignCanvasRequest>
   ) { }


   toString(): string {
      return ImagePolicySupport.toString<P, R>(this.policy, this.role);
   }

   static toString<P extends string, R extends string>(policy: P, role: R): string {
      return `${policy}::${role}`;
   }
}

class CanvasMetadata<P extends string, R extends string> {
   constructor(
      public readonly canvas: Canvas,
      public readonly context: MyCanvasRenderingContext2D,
      public readonly supports: ImagePolicySupport<P, R>)
   { }
}

function ack(promise: Promise<any>, label: string): void {
   promise.then(
      (value: any) => {
         util.log(`Resolved promise for ${label} as ${value}`);
      }
   ).catch(
      (error: any) => {
         util.error(`Rejected promise for ${label} with ${error}`);
      }
   )
}