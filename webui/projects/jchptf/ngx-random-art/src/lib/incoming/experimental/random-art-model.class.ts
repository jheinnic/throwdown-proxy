import 'rxjs/add/observable/range';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import * as RandomArtwork from './genjs5';
import {CanvasModels} from './canvas.models';
import PointMap = CanvasModels.PointMap;

export class RandomArtModel
{
  private readonly genModel: any;

  public constructor(
    public readonly context: CanvasRenderingContext2D,
    public readonly contentSeed: [number[], number[]],
    public readonly novel: boolean = true)
  {
    if (novel) {
      this.genModel = RandomArtwork.new_new_picture(contentSeed[0], contentSeed[1]);
    } else {
      this.genModel = RandomArtwork.new_picture(contentSeed[0], contentSeed[1]);
    }
  }

  public render(pointMap: PointMap, context: CanvasRenderingContext2D): void
  {
    pointMap.render(this.genModel, context);
  }

  public compute_pixel(xCalc: number, yCalc: number)
  {
    return RandomArtwork.compute_pixel(this.genModel, xCalc, yCalc);
  }
}

