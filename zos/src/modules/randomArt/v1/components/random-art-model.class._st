import {PointMap} from './point-map.class';
// import {new_new_picture, new_picture, compute_pixel} from './genjs5';

const genjs5 = require('../../genjs5');

export class RandomArtModel
{
   private genModel: any;

   public constructor(
      public readonly prefix: number[], public readonly suffix: number[],
      public readonly novel: boolean = true)
   {
      if (novel) {
         this.genModel = genjs5!.new_new_picture(prefix, suffix);
      } else {
         this.genModel = genjs5!.new_picture(prefix, suffix);
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

