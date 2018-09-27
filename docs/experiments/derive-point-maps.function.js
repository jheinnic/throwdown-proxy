"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var point_map_class_1 = require("../incoming/point-map.class");
var point_datamodel_1 = require("../incoming/point.datamodel");
function derivePointMaps(widthPoints, heightPoints) {
    return widthPoints.pipe(operators_1.flatMap(function (xVal, xIdx) {
        return heightPoints.pipe(operators_1.map(function (yVal, yIdx) {
            // console.log(xIdx, yIdx, ' => ', xVal, yVal);
            return new point_map_class_1.PointMap(xIdx, yIdx, xVal, yVal);
        }));
    }));
}
exports.derivePointMaps = derivePointMaps;
function oldDerivePointMaps(widthPoints, heightPoints) {
    return rxjs_1.from(widthPoints)
        .pipe(operators_1.flatMap(function (xVal, xIdx) {
        return rxjs_1.from(heightPoints)
            .pipe(operators_1.map(function (yVal, yIdx) {
            return [
                new point_datamodel_1.Point(undefined, {
                    x: xIdx,
                    y: yIdx
                }),
                new point_datamodel_1.Point(undefined, {
                    x: xVal,
                    y: yVal
                })
            ];
        }));
    })
    // map((pair: [Point, Point], index: number) =>
    //   new PointMap(pair[0].withId(index), pair[1]))
    );
}
//# sourceMappingURL=derive-point-maps.function.js.map