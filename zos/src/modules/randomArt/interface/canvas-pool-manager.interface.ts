import {Canvas} from 'canvas';

export interface ICanvasPoolManager
{
   createNew(): Canvas;
}