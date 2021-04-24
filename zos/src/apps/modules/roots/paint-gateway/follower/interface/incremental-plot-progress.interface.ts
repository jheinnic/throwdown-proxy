import { Canvas } from 'canvas';

import { IArtworkSeed } from './model';

export interface IncrementalPlotProgress {
   readonly canvas: Canvas;
   readonly modelSeed: IArtworkSeed;
   readonly done: number;
   readonly remaining: number;
   readonly total: number;
}

