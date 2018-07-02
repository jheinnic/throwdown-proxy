import canvas from 'canvas';
import Canvas = canvas.Canvas;

import {CanvasConsumer, ICanvasProvider} from './canvas-consumer.interface';

export class CanvasProvider implements ICanvasProvider {
  public allocateNextCanvas(canvasConsumer: CanvasConsumer): void
  {
    const canvasElement = this.createNextCanvas(canvasConsumer.pixelWidth, canvasConsumer.pixelHeight);
    canvasConsumer.next(canvasElement);
  }

  public createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas {
    const canvasElement: Canvas = new Canvas(pixelWidth, pixelHeight);
    const paintContext: CanvasRenderingContext2D = canvasElement.getContext('2d');

    /* TODO: Figure out quality settings
    paintContext.patternQuality = 'best';
    paintContext.filter = 'best';
    paintContext.antialias = 'subpixel';
    */

    return canvasElement;
  }
}
