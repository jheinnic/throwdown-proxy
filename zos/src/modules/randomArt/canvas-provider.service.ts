import {CanvasConsumer, Canvas, ICanvasProvider} from './canvas-consumer.interface';

const Canvas = require('canvas');

export class CanvasProvider implements ICanvasProvider {
  public allocateNextCanvas(canvasConsumer: CanvasConsumer): void
  {
    const canvas = this.createNextCanvas(canvasConsumer.pixelWidth, canvasConsumer.pixelHeight);
    canvasConsumer.next(canvas);
  }

  public createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas {
    const canvas = new Canvas(pixelWidth, pixelHeight) as Canvas;
    const paintContext = canvas.getContext('2d');
    if (! paintContext) {
      throw new Error('Could not get 2D painting context');
    }

    paintContext.patternQuality = 'best';
    paintContext.filter = 'best';
    paintContext.antialias = 'subpixel';

    return canvas;
  }

  // TODO: Allocate PointMap batches in tandem?
}
