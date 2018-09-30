import {PointMap} from './point-map.class';
// import {fnnnew_new_picture, new_picture, compute_pixel} from './genjs5';

const genjs5 = require('../genjs5');

export class RandomArtModel
{
  private genModel: any;

  public constructor(public readonly seedPhrase: [number[], number[]], public readonly novel: boolean = true) {
    if (novel) {
      this.genModel = genjs5!.new_new_picture(seedPhrase[0], seedPhrase[1]);
    } else {
      this.genModel = genjs5!.new_picture(seedPhrase[0], seedPhrase[1]);
    }
  }

  public render(pointMap: PointMap, context: CanvasRenderingContext2D): void
  {
    pointMap!.render(this.genModel, context);
  }

  public compute_pixel(xCalc: number, yCalc: number)
  {
    return genjs5!.compute_pixel(this.genModel, xCalc, yCalc);
  }
}

