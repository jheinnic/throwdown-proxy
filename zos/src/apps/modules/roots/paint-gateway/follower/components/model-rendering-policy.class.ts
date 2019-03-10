import { IterableX } from 'ix/iterable';
import { flatMap } from 'ix/iterable/pipe/flatmap';
import { memoize } from 'ix/iterable/pipe/memoize';
import { buffer } from 'ix/iterable/pipe/buffer';
import { map } from 'ix/iterable/pipe/map';
import { illegalArgs } from '@thi.ng/errors';
import { Canvas } from 'canvas';
import ndarray from 'ndarray';

import {
   IModelRenderingPolicy, MappedPoint, PlotGridData,
   IncrementalPlotter, IRandomArtModel, IWorkPartitions
} from '../interface';
import { stepRange } from '../../../../../../infrastructure/lib';

export class ModelRenderingPolicy implements IModelRenderingPolicy
{
   private readonly mappedPoints: IterableX<MappedPoint[]>;

   private readonly width: number;

   private readonly height: number;

   private readonly pixelMulti: number;

   private readonly sliceCount: number;

   public constructor(
      {xCount, yCount, pixelMulti, dataArray}: PlotGridData,
      {sliceCount, sliceSize}: IWorkPartitions)
   {
      const ndDataArray = ndarray(dataArray, [xCount / pixelMulti, yCount / pixelMulti, 2]);
      const xPointCount = xCount / pixelMulti;
      const yPointCount = yCount / pixelMulti;

      this.width = xCount;
      this.height = yCount;
      this.pixelMulti = pixelMulti;
      this.sliceCount = sliceCount;

      if ((
         xPointCount * yPointCount / sliceCount
      ) !== sliceSize)
      {
         console.error(
            `Policy dimensions mismatched!
x=${xPointCount}, y=${yPointCount},
size=${sliceSize}, count=${sliceCount}`);
      }

      this.mappedPoints = stepRange(0, xPointCount, pixelMulti)
         .pipe(
            flatMap((xCanvas: [number, number]): Iterable<MappedPoint> =>
               stepRange(0, yPointCount, pixelMulti)
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
      genModel: IRandomArtModel, canvas: Canvas, resizeCanvasOk: boolean = true
   ): IncrementalPlotter
   {
      console.log('Calling create IncrementalPlotter');
      if ((
         canvas.height !== this.height
      ) || (
         canvas.width != this.width
      ))
      {
         if (resizeCanvasOk) {
            canvas.height = this.height;
            canvas.width = this.width;
         } else {
            throw illegalArgs(
               `Cannot use canvas: ${canvas.height} != ${this.height} and/or ${canvas.width} != ${this.width}`);
         }
      }

      return this.mappedPoints.pipe(
         genModel.plot(canvas, this.sliceCount, this.pixelMulti)
      );
   }
}

            // flatMap((buffer: MappedPoint[]) => buffer),
            // tap(callback),
            // scan((previousValue: number) => {
            //    if (previousValue === 0) {
            //       return this.sliceSize - 1;
            //    }
            //    return previousValue - 1;
            // }, this.sliceSize - 1),
            // filter(previousValue => (previousValue === 0)),
            // startWith(0),
            // map<number, IncrementalPlotProgress>(
            //    (_value: number, ii: number) => (
            //       {
            //          plotter: retVal,
            //          done: ii,
            //          remaining: this.sliceCount - ii,
            //          total: this.sliceCount
            //       }
            //    )
            // )


