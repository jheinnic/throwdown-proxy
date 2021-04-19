import { Canvas } from 'canvas';
import { OperatorFunction } from 'ix/interfaces';

import { MappedPoint } from './mapped-point.interface';
import { IncrementalPlotProgress } from '../../interface';


export interface IRandomArtworkModel {
   plot(
      canvas: Canvas, sliceCount?: number, pixelMulti?: number
   ): OperatorFunction<MappedPoint[], IncrementalPlotProgress>
}