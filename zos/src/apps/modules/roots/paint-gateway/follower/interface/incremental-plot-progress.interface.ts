import { Canvas } from 'canvas';

import { IModelSeed } from './model';

export interface IncrementalPlotProgress {
   readonly canvas: Canvas;
   readonly modelSeed: IModelSeed;
   readonly done: number;
   readonly remaining: number;
   readonly total: number;
}

