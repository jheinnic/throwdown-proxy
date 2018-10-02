import {Canvas} from 'canvas';

export interface ICanvasPoolManager
{
   // createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas;
   createNew(): Canvas;


}