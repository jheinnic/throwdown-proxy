import {injectable} from 'inversify';
import {
   installerRequest, requiredImport, DI_COMMON_TAGS, IContainerAccessStrategy
} from '@jchptf/di-app-registry';
import {Chan} from "chan";
import {Chanel} from "chanel";
import {Queue} from "co-priority-queue";

import {
   CanvasAvailableMessage, DeferrableMessage, InputTaskMessage, LifecycleStopMessage,
   PaintEngineTaskMessage, WriteOutputTaskMessage
} from '../messages';
import {CO_TYPES, QueueFactory} from '../../../infrastructure/coroutines/di';
import {IncrementalPlotterFactory} from '../interfaces';
import {RANDOM_ART_VARIANT_TAGS} from './tags';

@injectable()
@installerRequest()
export class RandomArtModuleImports<P extends string, R extends string> {

   @requiredImport(
      CO_TYPES.Chan,
      { type: 'tagged', key: DI_COMMON_TAGS.VariantFor, value: RANDOM_ART_VARIANT_TAGS.InputTask },
      'Singleton'
   )
   public inputTaskChan: IContainerAccessStrategy<Chan<InputTaskMessage<P, R>>>;

   private readonly taskLoader: Chan<InputTaskMessage<P, R>>,
   private readonly canvasReturn: Queue<CanvasAvailableMessage>,
   private readonly stopSignal: Queue<LifecycleStopMessage>,
   private readonly deferredQueueFactory: QueueFactory<DeferrableMessage>,
      private readonly plotFactories: Map<P, Map<R, IncrementalPlotterFactory>>,
      private readonly paintingChannel: Chanel<PaintEngineTaskMessage<P, R>>,
      private readonly outputChannel: Chanel<WriteOutputTaskMessage<P, R>>)
}