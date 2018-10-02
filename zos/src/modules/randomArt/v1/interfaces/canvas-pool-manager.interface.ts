import {Canvas} from 'canvas';

export interface ICanvasProvider
{
   createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas;
}