import {IncrementalPlotter} from './incremental-plotter.interface';

export interface IncrementalPlotProgress {
   readonly plotter: IncrementalPlotter;
   readonly done: number;
   readonly remaining: number;
   readonly total: number;
}