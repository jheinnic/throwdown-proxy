"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var mathjs_1 = require("mathjs");
var compute_affine_pixel_points_function_1 = require("./compute-affine-pixel-points.function");
var compute_deltas_histogram_function_1 = require("./compute-deltas-histogram.function");
var next_nearest_function_1 = require("./next-nearest.function");
mathjs_1.config({
    number: 'BigNumber',
    predictable: true,
    precision: 24,
    epsilon: 1e-12
});
// Project [0...(pointCount)] onto [minValue...maxValue] by affine matrix transformation in such a way that
// the set is symmetrically balanced (e.g. same distance between any consecutive points and the distance
// between either max or min and the center point are identical.  To do this, consider the symmetrical set
// of pointCount+1 items, and enumerate the values at the midpoint between any two points.
function bigComputeAffinePixelPoints(pointCount, minValue, maxValue) {
    var one = mathjs_1.bignumber(1);
    var initial = mathjs_1.bignumber(0.5);
    var translate = mathjs_1.bignumber(minValue);
    var range = mathjs_1.bignumber(maxValue - minValue);
    var numPts = mathjs_1.bignumber(pointCount);
    var scale = range.dividedBy(numPts);
    // let sum = add(translate, divide(multiply(initial, range), numPts));
    var pointsArrayOne = [];
    var pointsArrayTwo = [];
    // const pointsArrayThree = [];
    // const pointsArrayFour = [];
    // const pointsArrayFive = [];
    for (var ii = initial; ii.lessThan(numPts); ii = ii.add(one)) {
        pointsArrayOne.push(translate.add(scale.mul(ii))
            .toDecimalPlaces(14)
            .toNumber());
        pointsArrayTwo.push(translate.add(range.mul(ii)
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
exports.bigComputeAffinePixelPoints = bigComputeAffinePixelPoints;
function oldComputeAffinePixelPoints(pointCount, minValue, maxValue) {
    var initial = 0.5;
    var translate = minValue;
    var range = maxValue - minValue;
    var scale = range / pointCount;
    var pointsArrayOne = [];
    var pointsArrayTwo = [];
    // const pointsArrayThree = [];
    // const pointsArrayFour = [];
    // const pointsArrayFive = [];
    for (var ii = initial; ii < pointCount; ii += 1) {
        pointsArrayOne.push(translate + (ii * scale));
        pointsArrayTwo.push(translate + (ii * range / pointCount));
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
    function bigNumbersToNumbers(values) {
        return;
    }
}
exports.oldComputeAffinePixelPoints = oldComputeAffinePixelPoints;
function shiftNearest(minValue, maxValue) {
    return operators_1.map(function (value) {
        var nextLower = next_nearest_function_1.nextNearest(value, minValue);
        var nextHigher = next_nearest_function_1.nextNearest(value, maxValue);
        var diffLower = value - nextLower;
        var diffHigher = value - nextHigher;
        if (diffLower < diffHigher) {
            return nextLower;
        }
        else if (diffHigher < diffLower) {
            return nextHigher;
        }
        return value;
    });
}
function aggregateBuckets() {
    return operators_1.reduce(function (acc, value) { return (acc + (value.key * value.count)); }, 0);
}
function analyze() {
    return function (source) {
        return source.pipe(compute_deltas_histogram_function_1.computeDeltasHistogram(-1, 1), operators_1.tap(console.log), aggregateBuckets());
    };
}
var numPoints = 480;
var previewCount = 5;
var origData = rxjs_1.from(compute_affine_pixel_points_function_1.computeAffinePixelPoints(numPoints, -1, 1))
    .pipe(operators_1.shareReplay(numPoints));
var shiftedData = origData.pipe(shiftNearest(-1, 1), operators_1.shareReplay(numPoints));
console.log('Shifted Set');
shiftedData.pipe(analyze())
    .subscribe(console.log);
console.log('Original Set');
origData.pipe(analyze())
    .subscribe(console.log);
rxjs_1.concat(origData.pipe(operators_1.take(previewCount)), rxjs_1.of('...'), origData.pipe(operators_1.skip(numPoints - previewCount))).subscribe(console.log);
//# sourceMappingURL=playing2.js.map
