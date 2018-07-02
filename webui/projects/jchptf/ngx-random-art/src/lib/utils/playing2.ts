import {Observable, from, concat, of} from 'rxjs';
import {map, reduce, shareReplay, take, skip, tap} from 'rxjs/operators';
import {bignumber, BigNumber, config} from 'mathjs';
import {computeAffinePixelPoints} from './compute-affine-pixel-points.function';
import {computeDeltasHistogram, HistogramBucket} from './compute-deltas-histogram.function';
import {nextNearest} from './next-nearest.function';

config({
  number: 'BigNumber',
  predictable: true,
  precision: 24,
  epsilon: 1e-12
});

// Project [0...(pointCount)] onto [minValue...maxValue] by affine matrix transformation in such a way that
// the set is symmetrically balanced (e.g. same distance between any consecutive points and the distance
// between either max or min and the center point are identical.  To do this, consider the symmetrical set
// of pointCount+1 items, and enumerate the values at the midpoint between any two points.
export function bigComputeAffinePixelPoints(
  pointCount: number,
  minValue: number,
  maxValue: number): [number[], number[]]
{
  const one = bignumber(1);
  const initial = bignumber(0.5);
  const translate = bignumber(minValue);
  const range = bignumber(maxValue - minValue);
  const numPts = bignumber(pointCount);
  const scale = range.dividedBy(numPts);
  // let sum = add(translate, divide(multiply(initial, range), numPts));

  const pointsArrayOne = [];
  const pointsArrayTwo = [];
  // const pointsArrayThree = [];
  // const pointsArrayFour = [];
  // const pointsArrayFive = [];
  for (
    let ii = initial; ii.lessThan(numPts); ii = ii.add(one))
  {
    pointsArrayOne.push(
      translate.add(scale.mul(ii))
        .toDecimalPlaces(14)
        .toNumber());
    pointsArrayTwo.push(
      translate.add(range.mul(ii)
        .div(numPts))
        .toDecimalPlaces(14)
        .toNumber());
    // pointsArrayThree.push(sum);
    // pointsArrayFour.push((
    //   (
    //     translate + (
    //       ii * scale
    //     )
    //   ) + (
    //     translate + (
    //       sum2 / pointCount
    //     )
    //   )
    // ) / 2.0);
    // pointsArrayThree.push((
    //   pointsArrayOne[ii - 0.5] + pointsArrayTwo[ii - 0.5]
    // ) / 2.0);
    // sum += scale;
  }

  /*
  range(0, pointCount).pipe(
    map((value) => (
      (
        value + 0.5
      ) * scale
    ) + translate)
  ).subscribe(console.log);
  return range(0, pointCount).pipe(
    map((value) => (
      (
        value + 0.5
      ) * scale
    ) + translate));
  */
  return [pointsArrayOne, pointsArrayTwo];
}

export function oldComputeAffinePixelPoints(
  pointCount: number,
  minValue: number,
  maxValue: number): [number[], number[]]
{
  const initial = 0.5;
  const translate = minValue;
  const range = maxValue - minValue;
  const scale = range / pointCount;

  const pointsArrayOne = [];
  const pointsArrayTwo = [];
  // const pointsArrayThree = [];
  // const pointsArrayFour = [];
  // const pointsArrayFive = [];
  for (let ii = initial; ii < pointCount; ii += 1)
  {
    pointsArrayOne.push(
      translate + (
        ii * scale
      )
    );
    pointsArrayTwo.push(
      translate + (
        ii * range / pointCount
      )
    );

    // pointsArrayThree.push(sum);
    // pointsArrayFour.push((
    //   (
    //     translate + (
    //       ii * scale
    //     )
    //   ) + (
    //     translate + (
    //       sum2 / pointCount
    //     )
    //   )
    // ) / 2.0);
    // pointsArrayThree.push((
    //   pointsArrayOne[ii - 0.5] + pointsArrayTwo[ii - 0.5]
    // ) / 2.0);
    // sum += scale;
    return [pointsArrayOne, pointsArrayTwo];
  }

  function bigNumbersToNumbers(values: BigNumber[])
  {
    return;
  }
}

function shiftNearest(minValue: number, maxValue: number)
{
  return map((value: number) => {
    const nextLower = nextNearest(value, minValue);
    const nextHigher = nextNearest(value, maxValue);
    const diffLower = value - nextLower;
    const diffHigher = value - nextHigher;

    if (diffLower < diffHigher) {
      return nextLower;
    } else if (diffHigher < diffLower) {
      return nextHigher;
    }

    return value;
  });
}

function aggregateBuckets()
{
  return reduce((acc: number, value: HistogramBucket) => (
    acc + (value.key * value.count)
  ), 0);
}

function analyze() {
  return (source: Observable<number>) => {
    return source.pipe(
      computeDeltasHistogram(-1, 1),
      tap(console.log),
      aggregateBuckets());
  };
}

const numPoints = 511;
const previewCount = 5;


const origData = from(computeAffinePixelPoints(numPoints, -1, 1))
  .pipe(shareReplay(numPoints));
const shiftedData = origData.pipe(
  shiftNearest(-1, 1),
  shareReplay(numPoints));

console.log('Shifted Set');
shiftedData.pipe(
  analyze()
)
  .subscribe(console.log);

console.log('Original Set');
origData.pipe(
  analyze()
)
  .subscribe(console.log);

concat(
  origData.pipe(take(previewCount)),
  of('...'),
  origData.pipe(skip(numPoints - previewCount))
).subscribe(console.log);
