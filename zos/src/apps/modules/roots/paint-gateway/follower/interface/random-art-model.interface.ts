import { Canvas } from 'canvas';
import { OperatorFunction } from 'ix/interfaces';

import { IncrementalPlotProgress } from '.';
import { MappedPoint } from './model';

export interface IRandomArtModel {
   plot(
      canvas: Canvas, sliceCount?: number, pixelMulti?: number
   ): OperatorFunction<MappedPoint[], IncrementalPlotProgress>
}