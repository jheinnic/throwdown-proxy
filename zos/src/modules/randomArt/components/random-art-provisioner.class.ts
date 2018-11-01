import {injectable} from 'inversify';
import {IConcurrentWorkFactory} from '@jchptf/coroutines';
import {CanvasDimensions, AssignCanvasRequest, PaintEngineTaskMessage} from '../messages';
import {IncrementalPlotterFactory} from '../interfaces';
import chan from 'chan';
import {co} from 'co';
import {Canvas} from 'canvas';
import * as canvas from 'canvas';

@injectable
export class RandomArtCanvasManager {
   private inputTaskChannel: Chan.Chan<AssignCanvasRequest>;

   private availableCanvasChannel: Chan.Chan<Canvas>;

   private plotGenerator: IncrementalPlotterFactory;

   private concurrentWorkFactory: IConcurrentWorkFactory;

   constructor(
      inputTaskChannel: Chan.Chan<AssignCanvasRequest>,
      availableCanvasChannel: Chan.Chan<Canvas>,
      plotGenerator: IncrementalPlotterFactory,
      concurrentWorkFactory: IConcurrentWorkFactory,
   ) {
      this.inputTaskChannel = inputTaskChannel;
      this.plotGenerator = plotGenerator;
      this.concurrentWorkFactory = concurrentWorkFactory;
   }

   public acceptWork(inputMessage: AssignCanvasRequest): Promise<any> {
      const inputQueues = this.canvasInputQueues;
      return co(function * () {
         const selected = yield chan.select(...inputQueues);
         return yield selected(inputMessage);
      });
   }

   public registerCanvas(availableCanvas: Canvas ) {
      if (this.plotGenerator.isCompatible(availableCanvas) {
         const newChan: Chan<AssignCanvasRequest> = chan<AssignCanvasRequest>();
         co(function* () {

         })
      })
   }

}