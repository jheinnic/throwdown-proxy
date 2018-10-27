import {IterableX} from 'ix/iterable';

import {IncrementalPlotter, IncrementalPlotObserver, MappedPoint} from '.';
import {ConcreteFactoryService} from '@jchptf/di-app-registry';
import {Canvas} from 'canvas';

export interface IncrementalPlotterFactory extends ConcreteFactoryService<'create', IncrementalPlotter, [IncrementalPlotObserver]> {
   createMapIter(callback: IncrementalPlotObserver): IterableX<MappedPoint>;

   isCompatible(canvas: Canvas): boolean;
}