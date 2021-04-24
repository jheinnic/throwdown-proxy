import { flatMap } from 'ix/iterable/pipe/flatmap';
import { memoize } from 'ix/iterable/pipe/memoize';
import { buffer } from 'ix/iterable/pipe/buffer';
import { map } from 'ix/iterable/pipe/map';
import { IterableX } from 'ix/iterable';
import { illegalArgs } from '@thi.ng/errors';
import { Canvas } from 'canvas';
import ndarray from 'ndarray';

import { stepRange } from '../../../../../../infrastructure/lib';

import { PlotGridData, IncrementalPlotter } from '../interface';
import { IArtworkRenderer, IRandomArtworkModel, IWorkPartitions, MappedPoint } from './interface';

export class ArtworkRenderer implements IArtworkRenderer
{
   private readonly mappedPoints: IterableX<MappedPoint[]>;

   private readonly pixelWidth: number;

   private readonly pixelHeight: number;

   private readonly pixelSize: number;

   private readonly sliceCount: number;

   public constructor(
      {xCount, yCount, pixelSize, dataArray}: PlotGridData,
      {sliceCount, sliceSize}: IWorkPartitions)
   {
      const ndDataArray = ndarray(dataArray, [xCount / pixelSize, yCount / pixelSize, 2]);
      const xPointCount = xCount / pixelSize;
      const yPointCount = yCount / pixelSize;

      this.pixelWidth = xCount;
      this.pixelHeight = yCount;
      this.pixelSize = pixelSize;
      this.sliceCount = sliceCount;

      if ((xPointCount * yPointCount / sliceCount) !== sliceSize)
      {
         console.error(
            `Policy dimensions mismatched!
x=${xPointCount}, y=${yPointCount},
size=${sliceSize}, count=${sliceCount}`);
      }

      this.mappedPoints = stepRange(0, xPointCount, pixelSize)
         .pipe(
            flatMap((xCanvas: [number, number]): Iterable<MappedPoint> =>
               stepRange(0, yPointCount, pixelSize)
                  .pipe(
                     map((yCanvas: [number, number]) =>
                        [
                           xCanvas[0], yCanvas[0],
                           ndDataArray.get(xCanvas[1], yCanvas[1], 0),
                           ndDataArray.get(xCanvas[1], yCanvas[1], 1)
                        ] as MappedPoint)
                  )
            ),
            buffer(sliceSize),
            memoize()
         );
   }

   public create(
      genModel: IRandomArtworkModel, canvas: Canvas, resizeCanvasOk: boolean = true
   ): IncrementalPlotter
   {
      console.log('Calling create IncrementalPlotter');
      if ((canvas.height !== this.pixelHeight) || (canvas.width != this.pixelWidth)) {
         if (resizeCanvasOk) {
            canvas.height = this.pixelHeight;
            canvas.width = this.pixelWidth;
         } else {
            throw illegalArgs(
               `Cannot use canvas: ${canvas.height} != ${this.pixelHeight} and/or ${canvas.width} != ${this.pixelWidth}`);
         }
      }

      return this.mappedPoints.pipe(
         genModel.plot(canvas, this.sliceCount, this.pixelSize)
      );
   }
}
