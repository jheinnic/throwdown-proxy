"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mathjs_1 = require("mathjs");
// Project [0...(pointCount)] onto [minValue...maxValue] by affine matrix transformation in such a way that
// the set is symmetrically balanced (e.g. same distance between any consecutive points and the distance
// between either max or min and the center point are identical.  To do this, consider the symmetrical set
// of pointCount+1 items, and enumerate the values at the midpoint between any two points.
function computeAffinePixelPoints(pointCount, minValue, maxValue) {
    var one = mathjs_1.bignumber(1);
    var initial = mathjs_1.bignumber(0.5);
    var translate = mathjs_1.bignumber(minValue);
    var range = mathjs_1.bignumber(maxValue - minValue);
    var numPts = mathjs_1.bignumber(pointCount);
    // const scale = range.dividedBy(numPts);
    var pointsArray = new Array(pointCount);
    for (var ii = initial, jj = 0; ii.lessThan(numPts); ii = ii.add(one), jj++) {
        pointsArray[jj] =
            // parseFloat(
            translate.add(range.mul(ii)
                .div(numPts))
                .toSignificantDigits(13).toNumber();
        // .toPrecision(13);
    }
    console.log(pointsArray);
    return pointsArray;
}
exports.computeAffinePixelPoints = computeAffinePixelPoints;
// Project [0...(pointCount)] onto [minValue...maxValue] by affine matrix transformation in such a way that
// the set is symmetrically balanced (e.g. same distance between any consecutive points and the distance
// between either max or min and the center point are identical.  To do this, consider the symmetrical set
// of pointCount+1 items, and enumerate the values at the midpoint between any two points.
function oldComputeAffinePixelPoints(pointCount, minValue, maxValue) {
    var initial = 0.5;
    var translate = minValue;
    var scale = (maxValue - minValue) / pointCount;
    var pointsArray = [];
    for (var ii = initial; ii < pointCount; ii += 1) {
        pointsArray.push((ii * scale) + translate);
    }
    return pointsArray;
}
exports.oldComputeAffinePixelPoints = oldComputeAffinePixelPoints;
//# sourceMappingURL=compute-affine-pixel-points.function.js.map