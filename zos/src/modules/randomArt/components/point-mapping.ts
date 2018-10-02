import {Iterable} from 'ix';
import {generate, IterableX} from 'ix/iterable';
import {map} from 'ix/iterable/pipe/map';
import {tap} from 'ix/iterable/pipe/tap';
import {flatMap} from 'ix/iterable/pipe/flatmap';
import {CompletionObserver, ErrorObserver, NextObserver} from 'ix/observer';
import BN from 'bn.js';

import {PlottingObserver} from '../interfaces/plotting-observer.interface';
import {PointMap} from './point-map.class';

interface Coordinate {
   x: number;
   y: number;
}

interface MappedPoint {
   canvas: Coordinate;
   model: Coordinate;
}

export class PointMapping
{
   private pointMap: IterableX<MappedPoint>;

   /**
    * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
    *
    * @param multiplicand
    * @param maxDivisor
    */
   public static findOptimalDivisor(multiplicand: number, maxDivisor: number)
   {
      if ((
         multiplicand % maxDivisor
      ) === 0)
      {
         return maxDivisor;
      }

      let ii;
      const sqrt = Math.floor(Math.sqrt(multiplicand));
      if (sqrt > maxDivisor) {
         for (ii = maxDivisor; ii > 1; ii--) {
            if ((
               multiplicand % ii
            ) === 0)
            {
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
         for (
            ii = 2;
            (
               ii < highLowHigh
            ) && (
               lowLowHigh === 0
            );
            ii++)
         {
            if ((
               multiplicand % ii
            ) === 0)
            {
               lowLowHigh = multiplicand / ii;
               if (lowLowHigh > maxDivisor) {
                  lowLowHigh = 0;
                  firstFound = false;
               }
            }
         }
         if ((
            lowLowHigh > 0
         ) && firstFound)
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

   public static computeAffinePixelPoints(
      pointCount: number,
      minValue: number,
      maxValue: number): Iterable<number>
   {
      const one = new BN(1);
      const translate = new BN(minValue);
      const pRange = new BN(maxValue - minValue);
      const numPts = new BN(pointCount);
      // const initial = new BN(0.5);
      // const scale = pRange.dividedBy(numPts);

      // const pointsArrayTwo = [];
      // for (let ii = initial; ii.lt(numPts); ii = ii.add(one)) {
      //   pointsArrayTwo.push(
      //     parseFloat(
      // translate.add(
      //   pRange.mul(ii)
      //     .div(numPts)
      // ).toNumber());
      // }
      // return from(pointsArrayTwo);

      return generate(
         new BN(minValue),
         (x: BN) => x.lt(numPts),
         (x: BN) => x.add(one),
         (x: BN) => translate.add(
            pRange.mul(x)
               .div(numPts)
         )
            .toNumber());
   }

   public static derivePointMaps(
      widthPoints: IterableX<number>,
      heightPoints: IterableX<number>): Iterable<PointMap>
   {
      return widthPoints.pipe(
         map<number, [number, number]>(
            (xVal: number, xIdx: number) => [xVal, xIdx]
         ),
         flatMap<[number, number], PointMap>((xPair: [number, number]) => {
            return heightPoints.pipe(
               map<number, PointMap>((yVal: number, yIdx: number) => {
                  // console.log(xIdx, yIdx, ' => ', xVal, yVal);
                  const xVal = xPair[0];
                  const xIdx = xPair[1];
                  return new PointMap(xIdx, yIdx, xVal, yVal);
               })
            );
         })
      );
   }

   private widthPoints: IterableX<[number, number]>;

   private heightPoints: IterableX<[number, number]>;

   // public static readonly CANVAS_DIM = 0;
   // public static readonly MODEL_DIM = 1;
   // public static readonly X_DIM = 0;
   // public static readonly Y_DIM = 1;

   public constructor(
      private readonly xCount = 0,
      private readonly xMin = 0,
      private readonly xMax = 0,
      private readonly yCount = 0,
      private readonly yMin = 0,
      private readonly yMax = 0)
   {
      this.widthPoints = PointMapping.computeAffinePixelPoints(this.xCount, this.xMin, this.xMax)
         .pipe(
            map((value: number, index: number) => [index, value] as [number, number]));
      this.heightPoints = PointMapping.computeAffinePixelPoints(this.yCount, this.yMin, this.yMax)
         .pipe(
            map((value: number, index: number) => [index, value] as [number, number]));
      this.pointMap = this.widthPoints.pipe(
         flatMap((xPair: [number, number]): Iterable<MappedPoint> =>
            this.heightPoints.pipe(
               map((yPair: [number, number]) => (
                  {
                     canvas: {
                        x: xPair[0],
                        y: yPair[0]
                     },
                     model: {
                        x: xPair[1],
                        y: yPair[1]
                     }
                  }
               )))))
   }

   public createPlotter(callback: PlottingObserver): Iterable<MappedPoint>
   {
      return this.pointMap.pipe(
         tap(
            new PlottingPartialObserver(callback)
         )
      );
   }
}

class PlottingPartialObserver implements NextObserver<MappedPoint>, ErrorObserver<MappedPoint>, CompletionObserver<MappedPoint>
{
   constructor(private readonly plotter: PlottingObserver) { }

   private _closed: boolean = false;

   public get closed(): boolean {
      return this._closed;
   }

   public complete(): void {
      if (! this._closed) {

      }
   }

   public error(err: any): void
   {
      this.plotter.onError(err);
   }

   public next(value: MappedPoint): void {
      try {
         this.plotter.plot(value.canvas.x, value.canvas.y, value.model.x, value.model.y)
      } catch(err) {
         this.error(err);
      }
   }
}
