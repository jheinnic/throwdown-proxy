import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {Observable} from 'rxjs';

import {PointMap, RandomArtModel} from '../components';

export interface CanvasAndPlotModel
{
  readonly genModel: RandomArtModel;
  readonly canvas: Canvas;
  readonly paintContext: MyCanvasRenderingContext2D;
  readonly pointMapBatches: Observable<Observable<PointMap>>;
  readonly outputFilePath: string;
}
