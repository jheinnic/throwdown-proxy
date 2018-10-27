import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {RandomArtModel} from '../components';
import {IncrementalPlotter} from '../interfaces';

export class PaintingArtifacts
{
   constructor(
      public readonly genModel: RandomArtModel,
      public readonly canvas: Canvas,
      public readonly paintContext: MyCanvasRenderingContext2D,
      public readonly plotter: IncrementalPlotter
   ) { }
}