import {injectable} from 'inversify';
import {
   installerRequest, requiredImport, DI_COMMON_TAGS, IContainerAccessStrategy
} from '@jchptf/di-app-registry';
import {Chanel} from "chanel";
import Queue from "co-priority-queue";

import {
   CanvasAvailableMessage, DeferrableMessage, AssignCanvasRequest, LifecycleStopMessage,
   PaintEngineTaskMessage, WriteOutputTaskMessage
} from '../messages';
import {CO_TYPES, IConcurrentWorkFactory} from '@jchptf/coroutines';
import {IncrementalPlotterFactory} from '../interfaces';
import {RANDOM_ART_VARIANT_TAGS} from './tags';

@injectable()
@installerRequest()
export class RandomArtModuleImports {

   @requiredImport(
      CO_TYPES.Chan,
      { type: 'tagged', key: DI_COMMON_TAGS.VariantFor, value: RANDOM_ART_VARIANT_TAGS.InputTask },
      'Singleton'
   )
   public inputTaskChan: IContainerAccessStrategy<Chan.Chan<AssignCanvasRequest>>;

   private readonly taskLoader: Chan.Chan<AssignCanvasRequest>,
   private readonly canvasReturn: Queue<CanvasAvailableMessage>,
   private readonly stopSignal: Queue<LifecycleStopMessage>,
   private readonly deferredQueueFactory: QueueFactory<DeferrableMessage>,
      // private readonly plotFactories: Map<P, Map<R, IncrementalPlotterFactory>>,
      private readonly paintingChannel: Chanel<PaintEngineTaskMessage>,
      private readonly outputChannel: Chanel<WriteOutputTaskMessage>)
}