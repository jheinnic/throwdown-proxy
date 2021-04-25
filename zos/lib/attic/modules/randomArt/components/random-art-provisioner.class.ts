// import {injectable} from 'inversify';
import {IConcurrentWorkFactory} from '@jchptf/coroutines';
import {AssignCanvasRequest} from '../messages';
import {IncrementalPlotterFactory} from '../interface';
import {co} from 'co';
import {Canvas} from 'canvas';
import {any, Chan} from 'medium';

// @injectable()
export class RandomArtCanvasManager {
   // @ts-ignore
   private inputTaskChannel: Chan<AssignCanvasRequest>;

   // @ts-ignore
   private availableCanvasChannel: Chan<Canvas>;

   private plotGenerator: IncrementalPlotterFactory;

   private concurrentWorkFactory: IConcurrentWorkFactory;

   constructor(
      inputTaskChannel: Chan<AssignCanvasRequest>,
      availableCanvasChannel: Chan<Canvas>,
      plotGenerator: IncrementalPlotterFactory,
      concurrentWorkFactory: IConcurrentWorkFactory,
   ) {
      this.inputTaskChannel = inputTaskChannel;
      this.availableCanvasChannel = availableCanvasChannel;
      this.plotGenerator = plotGenerator;
      this.concurrentWorkFactory = concurrentWorkFactory;
   }

   public acceptWork(inputMessage: AssignCanvasRequest): Promise<any> {
      // @ts-ignore
      const inputQueues = this.canvasInputQueues;
      return co(function * () {
         const selected = yield any(...inputQueues);
         return yield selected(inputMessage);
      });
   }

   public registerCanvas(availableCanvas: Canvas ) {
      if (this.plotGenerator.isCompatible(availableCanvas)) {
         const newChan: Chan<AssignCanvasRequest> = this.concurrentWorkFactory.createChan();
         co(function * () {
            yield undefined;
         })
      }
   }
}