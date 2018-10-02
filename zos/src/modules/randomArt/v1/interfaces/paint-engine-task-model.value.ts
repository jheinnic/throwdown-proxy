import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {Observable} from 'rxjs';

import {PointMap, RandomArtModel} from '../components/index';

export class PaintEngineTaskModel
{
   constructor(
      // public readonly eventId: string,
      // public readonly taskName: string,
      // public readonly policyName: string,
      public readonly prefixBits: Uint8Array,
      public readonly suffixBits: Uint8Array,
      public readonly genModel: RandomArtModel,
      public readonly canvas: Canvas,
      public readonly paintContext: MyCanvasRenderingContext2D,
      public readonly pointMapBatches: Observable<Observable<PointMap>>,
      public readonly outputFilePath: string,
      public readonly generation: number,
      public readonly novel: boolean
   ) {}

}
