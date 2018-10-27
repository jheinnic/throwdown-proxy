import {Iterable} from '@reactivex/ix-ts';

import {PointMap} from '../components/index';
import {InputTaskMessage} from '../messages/index';

export interface ITaskLoader extends IterableIterator<InputTaskMessage>
{
   // readonly pixelWidth: number;
   // readonly pixelHeight: number;
   // readonly dimensionToken: string;
   // readonly fitOrFill: 'square' | 'fit' | 'fill';
   // readonly pointMapBatches: Iterable<Iterable<PointMap>>

   // assignNextTask(): OperatorFunction<Canvas, PaintEngineTaskModel>

}
