import { Canvas } from 'canvas';
import { OperatorFunction } from 'ix/interfaces';

import { IAdapter } from '@jchptf/api';
import { IncrementalPlotProgress } from '.';
import { MappedPoint } from './model';

export interface IRandomArtModel {
   plot(
      canvasAdapter: IAdapter<Canvas>, sliceCount?: number, pixelMulti?: number
   ): OperatorFunction<MappedPoint[], IncrementalPlotProgress>
}