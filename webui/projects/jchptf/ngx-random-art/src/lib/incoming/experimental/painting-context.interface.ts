import {RandomArtModel} from './random-art-model.class';

export interface PaintingContext
{
  readonly genModel: RandomArtModel;
  readonly paintContext: CanvasRenderingContext2D;
  plots: number;
}

