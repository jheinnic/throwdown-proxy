import { Canvas } from 'canvas';

import { IRandomArtworkModel } from './random-artwork-model.interface';
import { IncrementalPlotter } from '../../interface';


export interface IArtworkRenderer
{
   create(
      genModel: IRandomArtworkModel, canvas: Canvas, canvasResizeOk?: boolean
   ): IncrementalPlotter;
}
