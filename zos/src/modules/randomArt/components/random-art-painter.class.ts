import {injectable} from 'inversify';
import {CanvasDimensions, InputTaskMessage, PaintEngineTaskMessage} from '../messages/index';
import {IncrementalPlotterFactory} from '../interfaces/index';
import {IConcurrentWorkFactory} from '@jchptf/coroutines';
import {chan, Chan} from 'chan';
import {co} from 'co';
import {Canvas} from 'canvas';
import * as canvas from 'canvas';

@injectable
export class RandomArtPainter {
   private canvasInputQueues: Chan<InputTaskMessage>[];

   private plotGenerator: IncrementalPlotterFactory;

   private concurrentWorkFactory: IConcurrentWorkFactory;

   constructor(
      plotGenerator: IncrementalPlotterFactory,
      concurrentWorkFactory: IConcurrentWorkFactory,
   ) {
      this.plotGenerator = plotGenerator;
      this.concurrentWorkFactory = concurrentWorkFactory;
   }

   public acceptWork(inputMessage: InputTaskMessage): Promise<any> {
      const inputQueues = this.canvasInputQueues;
      return co(function * () {
         const selected = yield chan.select(...inputQueues);
         return yield selected(inputMessage);
      });
   }

   public registerCanvas(availableCanvas: Canvas ) {
      if (this.plotGenerator.isCompatible(availableCanvas) {
         const newChan: Chan<InputTaskMessage> = chan<InputTaskMessage>();
         co(function* () {

         })
      })
   }

}