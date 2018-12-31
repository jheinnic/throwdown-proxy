import {IncrementalPlotter, IncrementalPlotObserver} from '.';
import {Canvas} from 'canvas';

export interface IncrementalPlotterFactory {
   create(observer: IncrementalPlotObserver): IncrementalPlotter;

   isCompatible(canvas: Canvas): boolean;
}