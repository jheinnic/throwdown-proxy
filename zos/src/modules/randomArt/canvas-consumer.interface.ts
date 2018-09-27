import {Readable} from 'stream';
import {Observer} from 'rxjs';

export interface PNGStream extends Readable {
  _read(): void;
}

export interface Context2D extends CanvasRenderingContext2D {
  patternQuality: string;
  filter: string;
  antialias: string;
}

export interface Canvas extends HTMLCanvasElement
{
  pngStream: PNGStream;
  createPNGStream(): PNGStream;

  getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes): Context2D | null;
  getContext(contextId: 'webgl' | 'experimental-webgl', contextAttributes?: WebGLContextAttributes): null;
  getContext(contextId: string, contextAttributes?: {}): Context2D | null;
}

export interface CanvasConsumer extends Observer<Canvas>
{
  readonly pixelWidth: number;
  readonly pixelHeight: number;
  // assignNextTask(canvas: Canvas): void;
}

export interface ICanvasProvider {
  /**
   * @deprecated Use createNextCanvas() instead so this can become a Factory.
   * @param {CanvasConsumer} canvasConsumer
   */
  allocateNextCanvas(canvasConsumer: CanvasConsumer): void;

  createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas;
}
