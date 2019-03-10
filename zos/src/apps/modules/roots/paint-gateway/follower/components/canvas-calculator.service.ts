import { Injectable } from '@nestjs/common';
import { Iterable } from 'ix';
import { generate } from 'ix/iterable';
import { flatMap } from 'ix/iterable/pipe/flatmap';
import { memoize } from 'ix/iterable/pipe/memoize';
import { map } from 'ix/iterable/pipe/map';
import ndarray from 'ndarray';
import math from 'mathjs';

import {
   MappedPoint, ICanvasCalculator, IModelRenderingPolicy, CanvasDimensions, RenderScale,
   PlotGridData, IWorkPartitions
} from '../interface';
import { ModelRenderingPolicy } from './model-rendering-policy.class';

@Injectable()
export class CanvasCalculator implements ICanvasCalculator
{
   /**
    * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
    *
    * @param multiplicand
    * @param maxDivisor
    */
   private static findOptimalDivisor(multiplicand: number, maxDivisor: number)
   {
      if ((multiplicand % maxDivisor) === 0)
      {
         return maxDivisor;
      }

      let ii;
      const sqrt = Math.floor(Math.sqrt(multiplicand));
      if (sqrt > maxDivisor) {
         for (ii = maxDivisor; ii > 1; ii--) {
            if ((multiplicand % ii) === 0) {
               return ii;
            }
         }

         return 1;
      } else {
         let highLowHigh = 0;
         for (ii = sqrt; highLowHigh === 0; ii--) {
            if ((
               multiplicand % ii
            ) === 0)
            {
               highLowHigh = ii;
            }
         }

         let firstFound = true;
         let lowLowHigh = 0;
         for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++)
         {
            if ((multiplicand % ii) === 0)
            {
               lowLowHigh = multiplicand / ii;
               if (lowLowHigh > maxDivisor) {
                  lowLowHigh = 0;
                  firstFound = false;
               }
            }
         }

         if ((lowLowHigh > 0) && firstFound)
         {
            return lowLowHigh;
         }

         const altHighLowHigh = multiplicand / highLowHigh;
         if (altHighLowHigh <= maxDivisor) {
            highLowHigh = altHighLowHigh;
         }

         if (lowLowHigh > highLowHigh) {
            highLowHigh = lowLowHigh;
         }

         return highLowHigh;
      }
   }

   private static computeAffinePixelPoints( pointCount: number, minValue: number, maxValue: number): Iterable<number>
   {
      const one = math.bignumber(1);
      const translate = math.bignumber(minValue);
      const pRange = math.bignumber(maxValue - minValue);
      const numPts = math.bignumber(pointCount);

      return generate(
         math.bignumber(0),
         (x: math.BigNumber) => x.lt(numPts),
         (x: math.BigNumber) => x.add(one),
         (x: math.BigNumber) => translate.add(
            pRange.mul(x)
               .div(numPts)
         ).toNumber());
   }

   public computePoints(
      canvasDimensions: CanvasDimensions, renderScale: RenderScale ): PlotGridData
   {
      const pixelMulti = renderScale.pixelSize;
      const xCount = canvasDimensions.pixelWidth;
      const yCount = canvasDimensions.pixelHeight;
      const scaleFactor = renderScale.unitScale;
      const fitOrFill = renderScale.fitOrFill;

      if ((pixelMulti % 2) !== 1)
      {
         throw new Error('Preview pixel multiplier must be odd so the approximations center right');
      }
      if (((xCount % pixelMulti) > 0) || ((yCount % pixelMulti) > 0))
      {
         throw new Error('Pixel multiplier must be able evenly divide width and height.');
      }

      let xScale = scaleFactor;
      let yScale = scaleFactor;

      if (xCount === yCount) {
         if (fitOrFill && fitOrFill !== 'square') {
            throw new Error('fitOrFill must be square if width === height');
         }
      } else if (fitOrFill === 'square') {
         throw new Error('fitOrFill cannot be square unless width === height');
      } else if (!fitOrFill) {
         throw new Error('fitOrFill must be set explicitly if width !== height');
      } else if (xCount > yCount) {
         if (fitOrFill === 'fill') {
            xScale *= xCount / yCount;
         } else {
            yScale *= yCount / xCount;
         }
      } else if (fitOrFill === 'fill') {
         yScale *= yCount / xCount;
      } else {
         xScale *= xCount / yCount;
      }
      const widthPoints: Iterable<number> =
         CanvasCalculator.computeAffinePixelPoints(xCount, 0.0 - xScale, xScale);
      const heightPoints: Iterable<number> =
         CanvasCalculator.computeAffinePixelPoints(yCount, 0.0 - yScale, yScale);

      const mappedPoints = widthPoints.pipe<[number, number], MappedPoint, MappedPoint>(
         map((xModel: number, xCanvas: number) => [xCanvas, xModel] as [number, number]),
         flatMap((xPair: [number, number]): Iterable<MappedPoint> =>
            heightPoints.pipe(
               map((yModel: number, yCanvas: number) =>
                  [xPair[0], yCanvas, xPair[1], yModel] as MappedPoint)
            )
         ),
         memoize(xCount * yCount)
      );

      const pointCount = xCount * yCount / pixelMulti / pixelMulti;
      const dataArray = new Float64Array(2 * pointCount);
      const dataView = ndarray(dataArray, [xCount / pixelMulti, yCount / pixelMulti, 2]);
      let pointTuple: MappedPoint;

      let xIndex = 0;
      let xCanvas = 0;
      let xDelta = 0;
      let yCanvas = 0;
      let yDelta = 0;
      let multiDelta = (
         pixelMulti - 1
      ) / 2;
      for (pointTuple of mappedPoints) {
         if (yDelta == multiDelta) {
            if (xDelta == multiDelta) {
               // The top left corner of every M x M pixel block receives a color taken
               // from the artwork model's center point for that same block.  This is why
               // we need an odd multiplier--so that M - 1 can evenly be split to either
               // side of the sampled color pixel.
               dataView.set(xCanvas, yCanvas, 0, pointTuple[2]);
               dataView.set(xCanvas, yCanvas, 1, pointTuple[3]);
               xCanvas += 1;
            } else {
               xDelta++;
            }

            if (++xIndex === xCount) {
               xDelta = xIndex = xCanvas = 0;
               yCanvas++;
               yDelta = 0;
            }
         } else {
            // Note--to skip over unused rows (yDelta increments) we still have to iterate
            // through all X points of the skipped row because they are in the data source.
            if (++xIndex === xCount) {
               xIndex = 0;
               yDelta++;
            }
         }
      }

      return { xCount, yCount, pixelMulti, dataArray };
   }

   public computePartitions(
      plotGrid: PlotGridData, maxPointsPerSlice: number): IWorkPartitions
   {
      const pointCount =
         plotGrid.xCount * plotGrid.yCount / plotGrid.pixelMulti / plotGrid.pixelMulti;
      const sliceSize = CanvasCalculator.findOptimalDivisor(pointCount, maxPointsPerSlice);
      const sliceCount = pointCount / sliceSize;

      return { sliceCount, sliceSize };
   }

   public create(
      maxPointsPerSlice: number, canvasDimensions: CanvasDimensions, renderScale: RenderScale
   ) : IModelRenderingPolicy
   {
      const plotGrid: PlotGridData = this.computePoints(canvasDimensions, renderScale);
      const workPartitions: IWorkPartitions = this.computePartitions(plotGrid, maxPointsPerSlice);

      return new ModelRenderingPolicy(plotGrid, workPartitions);
   }
}


