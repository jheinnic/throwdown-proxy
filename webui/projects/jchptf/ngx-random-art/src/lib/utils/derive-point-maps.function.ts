import {PolicyModels} from '../store/models/policy.models';
import ImageDimensions = PolicyModels.ImageDimensions;
import FitFillSquareRatio = PolicyModels.FitFillSquareRatio;
import {computeAffinePixelPoints} from './compute-affine-pixel-points.function';


export function derivePointMaps(imageDimensions: ImageDimensions)
{
  let xScale = 1.0;
  let yScale = 1.0;
  let relativeShape: FitFillSquareRatio;

  if (imageDimensions.pixelWidth === imageDimensions.pixelHeight) {
    if (imageDimensions.relativeShape && imageDimensions.relativeShape !== 'square') {
      throw new Error('relativeShape must be square if width === height');
    } else {
      relativeShape = 'square';
    }
  } else if (imageDimensions.relativeShape === 'square') {
    throw new Error('relativeShape cannot be square unless width === height');
  } else if (imageDimensions.pixelWidth > imageDimensions.pixelHeight) {
    if (imageDimensions.relativeShape === 'fill') {
      xScale = imageDimensions.pixelWidth / imageDimensions.pixelHeight;
      relativeShape = 'fill';
    } else {
      yScale = imageDimensions.pixelHeight / imageDimensions.pixelWidth;
      relativeShape = 'fit';
    }
  } else if (imageDimensions.relativeShape === 'fill') {
    yScale = imageDimensions.pixelHeight / imageDimensions.pixelWidth;
    relativeShape = 'fill';
  } else {
    xScale = imageDimensions.pixelWidth / imageDimensions.pixelHeight;
    relativeShape = 'fit';
  }

  // let pixelCount = imageDimensions.pixelWidth * imageDimensions.pixelHeight;
  let widthPoints =
    computeAffinePixelPoints(imageDimensions.pixelWidth, -1 * xScale, xScale);
  let heightPoints =
    computeAffinePixelPoints(imageDimensions.pixelHeight, -1 * yScale, yScale);

  return {
    ...imageDimensions,
    widthPoints: widthPoints,
    heightPoints: heightPoints
  };

  // pointMaps =
  //   PointMap.derivePointMaps(widthPoints, heightPoints);
  //
  // return widthPoints.pipe(
  //   flatMap<number, PointMap>((xVal: number, xIdx: number) => {
  //     return heightPoints.pipe(
  //       map<number, PointMap>((yVal: number, yIdx: number) => {
  //         console.log(xIdx, yIdx, ' => ', xVal, yVal);
  // return new PointMap(xIdx, yIdx, xVal, yVal);
  // })
  // );
  // })
  // );
}


/*
function oldDerivePointMaps(widthPoints: number[], heightPoints: number[]): Observable<[Point, Point]>
{
  return from(widthPoints)
    .pipe(
      flatMap((xVal: number, xIdx: number) => {
        return from(heightPoints)
          .pipe(
            map((yVal: number, yIdx: number) => {
              return [
                new Point(undefined, {
                  x: xIdx,
                  y: yIdx
                }),
                new Point(undefined, {
                  x: xVal,
                  y: yVal
                })
              ] as [Point, Point];
            })
          );
      })
      // map((pair: [Point, Point], index: number) =>
      //   new PointMap(pair[0].withId(index), pair[1]))
    );
}
*/
