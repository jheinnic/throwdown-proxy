import { Canvas } from 'canvas';

import { IRandomArtworkModel } from '../components/interface';
import { IncrementalPlotter } from './incremental-plotter.type';


export interface IArtworkRenderer
{
   create(genModel: IRandomArtworkModel, canvas: Canvas, canvasResizeOk?: boolean): IncrementalPlotter;
}
