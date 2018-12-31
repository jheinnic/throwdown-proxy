import {injectable} from 'inversify';
import {
   DI_COMMON_TAGS, IContainerAccessStrategy, installerRequest, requiredImport
} from '@jchptf/di-app-registry';
import {Chanel} from 'chanel';
import {Chan} from 'medium';
import Queue from 'co-priority-queue';

import {
   PaintToCanvasRequest, LifecycleStopMessage, AssignCanvasRequest
} from '../messages';
import {CO_TYPES} from '@jchptf/coroutines';
import {RANDOM_ART_VARIANT_TAGS} from './tags';

@injectable()
@installerRequest()
export class RandomArtModuleImports
{

   @requiredImport(
      CO_TYPES.Chan,
      {
         type: 'tagged',
         key: DI_COMMON_TAGS.VariantFor,
         value: RANDOM_ART_VARIANT_TAGS.InputTask
      },
      'Singleton'
   )
   public inputTaskChan: IContainerAccessStrategy<Chan<AssignCanvasRequest>>;

   constructor(
      // readonly taskLoader: Chan<AssignCanvasRequest>,
      // readonly canvasReturn: Queue<CanvasAvailableMessage>,
      readonly stopSignal: Queue<AssignCanvasRequest>,
      // private readonly deferredQueueFactory: QueueFactory<DeferrableMessage>,
      // private readonly plotFactories: Map<P, Map<R, IncrementalPlotterFactory>>,
      readonly paintingChannel: Chanel<PaintToCanvasRequest>,
      // readonly outputChannel: Chanel<WriteOutputTaskMessage>,
      inputTaskChan: IContainerAccessStrategy<Chan<AssignCanvasRequest>>)
   {
      this.inputTaskChan = inputTaskChan;
   }

}
