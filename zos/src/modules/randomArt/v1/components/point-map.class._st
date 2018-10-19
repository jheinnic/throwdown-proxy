import {from, Observable} from 'rxjs';
import {RandomArtModel} from './random-art-model.class';
import BN from 'bn.js';
import {flatMap, map} from 'rxjs/operators';

// export type FitOrFillType = 'fit' | 'fill' | 'square';

// export type FillStyle = string | CanvasGradient | CanvasPattern;

export class PointMap
{
  /**
   * Find the largest possible divisor of multiplicand that no greater than maxDivisor.
   *
   * @param multiplicand
   * @param maxDivisor
   */
  public static findOptimalDivisor(multiplicand: number, maxDivisor: number)
  {
    if ((multiplicand % maxDivisor) === 0) {
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
        if ((multiplicand % ii) === 0) {
          highLowHigh = ii;
        }
      }

      let firstFound = true;
      let lowLowHigh = 0;
      for (ii = 2; (ii < highLowHigh) && (lowLowHigh === 0); ii++) {
        if ((multiplicand % ii) === 0) {
          lowLowHigh = multiplicand / ii;
          if (lowLowHigh > maxDivisor) {
            lowLowHigh = 0;
            firstFound = false;
          }
        }
      }
      if ((lowLowHigh > 0) && firstFound) {
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
    maxValue: number): Observable<number>
  {
    const one = new BN(1);
    const initial = new BN(0.5);
    const translate = new BN(minValue);
    const pRange = new BN(maxValue - minValue);
    const numPts = new BN(pointCount);
    // const scale = pRange.dividedBy(numPts);

    const pointsArrayTwo = [];
    for (let ii = initial; ii.lt(numPts); ii = ii.add(one)) {
      pointsArrayTwo.push(
        // parseFloat(
          translate.add(
            pRange.mul(ii)
              .div(numPts)
          ).toNumber());
    }

    return from(pointsArrayTwo);
  }

  public static derivePointMaps(
    widthPoints: Observable<number>,
    heightPoints: Observable<number>): Observable<PointMap>
  {
    return widthPoints.pipe(
       flatMap<number, PointMap>((xVal: number, xIdx: number) => {
          return heightPoints.pipe(
             map<number, PointMap>((yVal: number, yIdx: number) => {
                // console.log(xIdx, yIdx, ' => ', xVal, yVal);
                return new PointMap(xIdx, yIdx, xVal, yVal);
             })
          );
       })
    );
  }

  public constructor(
    private readonly xPlot = 0,
    private readonly yPlot = 0,
    private readonly xCalc = 0,
    private readonly yCalc = 0)
  { }

  public render(genModel: RandomArtModel, context: CanvasRenderingContext2D): boolean
  {
    context.fillStyle = genModel.compute_pixel(this.xCalc, this.yCalc);
    context.fillRect(this.xPlot, this.yPlot, 1, 1);
    return true;
  }

  public toString(): string
  {
    return `${this.xPlot},${this.yPlot} from ${this.xCalc},${this.yCalc}`;
  }
}

