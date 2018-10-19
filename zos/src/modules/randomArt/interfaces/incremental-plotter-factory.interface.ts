import {ConcreteFactory} from '../../../infrastructure/di';
import {Plotter, PlottingObserver} from '.';

export type PlotterFactory = ConcreteFactory<Plotter, [PlottingObserver]>