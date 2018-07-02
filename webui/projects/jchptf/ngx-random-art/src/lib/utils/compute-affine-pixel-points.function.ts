import {from} from 'rxjs';
import {bignumber} from 'mathjs';
import {map} from 'rxjs/operators';
// import {Point, PointMap} from '../incoming/point.datamodel';
import {Observable} from 'rxjs/index';

// Project [0...(pointCount)] onto [minValue...maxValue] by affine matrix transformation in such a way that
// the set is symmetrically balanced (e.g. same distance between any consecutive points and the distance
// between either max or min and the center point are identical.  To do this, consider the symmetrical set
// of pointCount+1 items, and enumerate the values at the midpoint between any two points.
export function computeAffinePixelPoints(
  pointCount: number,
  minValue: number,
  maxValue: number)
{
  const one = bignumber(1);
  const initial = bignumber(0.5);
  const translate = bignumber(minValue);
  const range = bignumber(maxValue - minValue);
  const numPts = bignumber(pointCount);
  // const scale = range.dividedBy(numPts);

  const pointsArray = new Array(pointCount);
  for (let ii = initial, jj = 0; ii.lessThan(numPts); ii = ii.add(one), jj++) {
    pointsArray[jj] =
      // parseFloat(
        translate.add(
          range.mul(ii)
            .div(numPts)
        )
          .toSignificantDigits(13).toNumber();
          // .toPrecision(13);
  }

  console.log(pointsArray);
  return pointsArray;
}

// Project [0...(pointCount)] onto [minValue...maxValue] by affine matrix transformation in such a way that
// the set is symmetrically balanced (e.g. same distance between any consecutive points and the distance
// between either max or min and the center point are identical.  To do this, consider the symmetrical set
// of pointCount+1 items, and enumerate the values at the midpoint between any two points.
export function oldComputeAffinePixelPoints(pointCount: number, minValue: number, maxValue: number)
{
  const initial = 0.5;
  const translate = minValue;
  const scale = (maxValue - minValue) / pointCount;

  const pointsArray = [];
  for (let ii = initial; ii < pointCount; ii += 1) {
    pointsArray.push((ii * scale) + translate);
  }
  return pointsArray;
}



