import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {RandomArtModel} from '../components';

export class PaintingArtifacts
{
   constructor(
      public readonly genModel: RandomArtModel,
      public readonly canvas: Canvas,
      public readonly paintContext: MyCanvasRenderingContext2D
   ) { }
}