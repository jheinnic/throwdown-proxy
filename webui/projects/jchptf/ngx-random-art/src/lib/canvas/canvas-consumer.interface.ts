import {Observer} from 'rxjs';
import {canvas} from './canvas';
import Canvas = canvas.Canvas;

export interface CanvasConsumer extends Observer<Canvas>
{
  readonly pixelWidth: number;
  readonly pixelHeight: number;
}

export interface ICanvasProvider {
  /**
   * @deprecated Use createNextCanvas() instead so this can become a Factory.
   * @param {CanvasConsumer} canvasConsumer
   */
  allocateNextCanvas(canvasConsumer: CanvasConsumer): void;

  createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas;
}
