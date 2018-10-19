import {Iterable} from '@reactivex/ix-ts';

import {PointMap} from '../components';

export interface ITaskLoader
{
   readonly pixelWidth: number;
   readonly pixelHeight: number;
   readonly dimensionToken: string;
   readonly fitOrFill: 'square' | 'fit' | 'fill';
   readonly pointMapBatches: Iterable<Iterable<PointMap>>

   // assignNextTask(): OperatorFunction<Canvas, PaintEngineTaskModel>
}
