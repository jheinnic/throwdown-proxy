import {injectable} from 'inversify';
import {co} from 'co';
import {Canvas} from 'canvas';
import {any, Chan, chan} from 'medium';
import {IncrementalPlotterFactory} from '../interface';
import {AssignCanvasRequest, PaintToCanvasRequest} from '../messages';

@injectable()
export class RandomArtPainter {
   // @ts-ignore
   private inputRequestChannel: Chan<PaintToCanvasRequest>;

   private plotGenerator: IncrementalPlotterFactory;

   // private concurrentWorkFactory: IConcurrentWorkFactory;

   constructor(
      inputRequestChannel: Chan<PaintToCanvasRequest>,
      plotGenerator: IncrementalPlotterFactory,
      // concurrentWorkFactory: IConcurrentWorkFactory,
   ) {
      this.inputRequestChannel = inputRequestChannel;
      this.plotGenerator = plotGenerator;
      // this.concurrentWorkFactory = concurrentWorkFactory;
   }

   public acceptWork(inputMessage: AssignCanvasRequest): Promise<any> {
      // @ts-ignore
      const inputQueues = this.canvasInputQueues;
      return co(function * () {
         const selected = yield any(...inputQueues);
         return yield selected(inputMessage);
      });
   }

   public registerCanvas(canvasEvent: Canvas ) {
      if (this.plotGenerator.isCompatible(canvasEvent)) {
         const newChan: Chan<AssignCanvasRequest> = chan<AssignCanvasRequest>();
         co(function * () {
            yield newChan;
         })
      }
   }
}