import { FitOrFill } from '../common';

export interface PlotGridData {
   readonly xCount: number,
   readonly yCount: number,
   readonly unitScale: number;
   readonly pixelSize: number,
   readonly fitOrFill: FitOrFill;
   readonly dataArray: Float64Array
}