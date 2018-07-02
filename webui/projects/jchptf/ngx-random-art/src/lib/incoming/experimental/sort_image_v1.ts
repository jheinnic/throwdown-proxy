import * as ndarray from 'ndarray';
import * as crypto from 'crypto';
import {isEqualWith} from 'lodash';
import {PolicyModels} from './policy.models';
import * as RandomArtGen from './genjs5';
import {IndividualModels} from './individuals.models';
import {derivePointMaps} from '../../utils/derive-point-maps.function';
import * as Canvas from 'canvas';

const bs = require('binary-search');

import ImageDimensions = PolicyModels.ImageDimensions;
import PaintProcessModel = IndividualModels.PaintProcessModel;
import PopulationModelPolicy = PolicyModels.PopulationModelPolicy;
import NameToken = IndividualModels.NameToken;

abstract class BaseColorState
{
  constructor() { }

  abstract get colorBytes(): number[];

  public static compareColors(m: BaseColorState, n: BaseColorState)
  {
    const mColorBytes = m.colorBytes;
    const nColorBytes = n.colorBytes;

    for (let ii = 0; ii < 3; ii++) {
      if (mColorBytes[ii] !== nColorBytes[ii]) {
        return mColorBytes[ii] - nColorBytes[ii];
      }
    }

    return 0;
  }

  public static createForSearch(colorBytes: number[]): LookupColorState
  {
    return new LookupColorState(colorBytes);
  }

  public updateForFirstFind(xCoord: number, yCoord: number): TrackingColorState
  {
    const colorBytes = this.colorBytes;
    const colorLabel = `rgb(${colorBytes[0]},${colorBytes[1]},${colorBytes[2]})`;
    return new TrackingColorState(colorBytes, colorLabel, xCoord, yCoord, xCoord, yCoord);
  }
}

/**
 * BaseColorState subtype intended for re-use as a search key for binary searches or other indexing schemes.  Its key value
 * is mutable to allow the object to be re-used for multiple searches, but it should therefore never be indexed in such a
 * collection itself.
 */
class LookupColorState extends BaseColorState
{
  constructor(private _colorBytes?: number[])
  {
    super();
  }

  public get colorBytes(): number[] {
    return this._colorBytes;
  }

  public set colorBytes(value: number[]) {
    this._colorBytes = value;
  }
}

/**
 * BaseColorState subtype used for durable tracking.  Its key is immutable and it is meant to be kept in a sorted collection
 * for retrieval by binary search or an indexed Map.  The class is not completely immutable--it encapsulates updatable last
 * seen properties.
 */
class TrackingColorState extends BaseColorState
{
  constructor(
    public readonly colorBytes: number[],
    public readonly colorLabel: string,
    public readonly xFirstSeen: number,
    public readonly yFirstSeen: number,
    public xLastSeen: number,
    public yLastSeen: number)
  {
    super();
  }

  // public updateForNextFind(xCoord: number, yCoord: number): TrackingColorState
  // {
  //   return new TrackingColorState(this.colorBytes, this.colorLabel, this.xFirstSeen, this.yFirstSeen, xCoord, yCoord);
  // }
}

const logComputeEvery = 5000;

function computePaintingPlan(
  paintProcess: PaintProcessModel, populationPolicy: PopulationModelPolicy): (context: CanvasRenderingContext2D) => Promise<any>
{
  const pixelWidth = populationPolicy.resolution.pixelWidth;
  const widthPoints = populationPolicy.painting.widthPoints;

  const pixelHeight = populationPolicy.resolution.pixelHeight;
  const heightPoints = populationPolicy.painting.heightPoints;

  const pixelCount = pixelWidth * pixelHeight;
  const progressTick = logComputeEvery / pixelCount;
  const prefixBytes = paintProcess.prefix.asUint8Array;
  const suffixBytes = paintProcess.suffix.asUint8Array;
  const seededModel = RandomArtGen.new_new_picture(prefixBytes, suffixBytes);
  const compute_pixel = RandomArtGen.partial_eval(seededModel);

  let lastColor = [-1, -1, -1];
  let colorLookup: LookupColorState = BaseColorState.createForSearch(lastColor);
  let currentColor: TrackingColorState = colorLookup.updateForFirstFind(-1, -1);
  let colorsAlreadySeen = [];
  let previousXIdx = -1;
  let previousYIdx = -1;
  let computeCounter = 0;
  let computeProgress = 0;

  const nextCellByCell = ndarray(new Uint16Array(pixelCount * 2), [pixelWidth, pixelHeight, 2]);

  for (let ii = 0; ii < pixelWidth; ii++) {
    for (let jj = 0; jj < pixelHeight; jj++) {
      const thisCell  = nextCellByCell.pick(ii, jj);
      const nextColor = compute_pixel(widthPoints[ii], heightPoints[jj]);

      if ((nextColor[0] === lastColor[0]) && (nextColor[1] === lastColor[1]) && (nextColor[2] === lastColor[2])) {
        thisCell.set(0, previousXIdx);
        thisCell.set(1, previousYIdx);
      } else {
        // Binary search to maintain easy lookup.
        colorLookup.colorBytes = nextColor;
        let bsIdx = bs(colorsAlreadySeen, colorLookup, BaseColorState.compareColors);

        if (bsIdx < 0) {
          // This cell will be the last in the linked chain for its color.  There is no previously found next
          // cell to link it to.  Whenever we reach this cell, the algorithm will resume at the head of an
          // unvisited color, but we won't know where those heads are until then.
          currentColor = colorLookup.updateForFirstFind(ii, jj);
          colorsAlreadySeen.splice((1 - bsIdx), 0, currentColor);
        } else {
          // This color has been seen before.  We don't want to link this cell to the previous one in in-order
          // traversal, but we would like to link it to the previous place where we have already seen the same =
          // color!
          currentColor = colorsAlreadySeen[bsIdx];

          thisCell.set(0, currentColor.xLastSeen);
          thisCell.set(1, currentColor.yLastSeen);
          currentColor.xLastSeen = ii;
          currentColor.yLastSeen = jj;
        }

        lastColor = currentColor.colorBytes;
      }

      if (computeCounter++ === logComputeEvery) {
        computeProgress += progressTick;
        computeCounter = 0;
        console.log('Compute progress is', computeProgress);
      }
    }
  }

  return function (paintContext: CanvasRenderingContext2D): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let paintCounter = 0, paintProgress = 0;
      for (const colorState of colorsAlreadySeen) {
        paintContext.fillStyle = colorState.colorLabel;

        let xx = colorState.xLastSeen;
        let yy = colorState.yLastSeen;

        while (xx >= 0) {
          if (yy < 0) {
            return reject(new Error('Only Y was marked with negative index, but not X?'));
          }

          paintContext.fillRect(xx, yy, 1, 1);
          xx = nextCellByCell.get(xx, yy, 0);
          yy = nextCellByCell.get(xx, yy, 1);
        }
        if (yy >= 0) {
          return reject(new Error('Only X was marked with negative index, but not Y?'));
        }

        if (paintCounter++ === logComputeEvery) {
          paintProgress += progressTick;
          paintCounter = 0;
          console.log('Paint progress is', paintProgress);
        }
      }

      return resolve(nextCellByCell);
    });
  };
}

const spec: ImageDimensions = {
  pixelWidth: 1024,
  pixelHeight: 512,
  relativeShape: 'fill'
};

const points = derivePointMaps(spec);
const pixelWidth = spec.pixelWidth;
const pixelHeight = spec.pixelHeight;
const pixelCount = spec.pixelWidth * spec.pixelHeight;

const prefix: Buffer = crypto.randomBytes(7);
const suffix: Buffer = crypto.randomBytes(11);

const genepools = require('../../../gene-pools.json');

const populationPolicy = genepools.populationModels[0];
const namePrefix = {
  asUtf8Text: 'Happy',
  asBase64Text: 'BlahBlah',
  asUint8Array: prefix
} as NameToken;
const nameSuffix = {
  asUtf8Text: 'Birthday',
  asBase64Text: 'BlohBluh',
  asUint8Array: suffix
} as NameToken;

const factoryMethod = computePaintingPlan({
  routingSlip: undefined,
  trackingUuid: 'uuid',
  populationPolicyUuid: populationPolicy.uuid,
  prefix: namePrefix,
  suffix: nameSuffix
}, populationPolicy);

const canvas = new Canvas.Canvas(512, 1024);
factoryMethod(canvas.getContext('2d')).then(console.log).catch(console.error);
