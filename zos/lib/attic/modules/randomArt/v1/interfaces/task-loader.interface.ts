import {Canvas} from 'canvas';
import {Observable, OperatorFunction} from 'rxjs';

import {PointMap} from '../components';
import {PaintEngineTaskModel} from './index';

export interface ITaskLoader
{
   readonly pixelWidth: number;
   readonly pixelHeight: number;
   readonly dimensionToken: string;
   readonly fitOrFill: 'square' | 'fit' | 'fill';
   readonly pointMapBatches: Observable<Observable<PointMap>>

   assignNextTask(): OperatorFunction<Canvas, PaintEngineTaskModel>
}
