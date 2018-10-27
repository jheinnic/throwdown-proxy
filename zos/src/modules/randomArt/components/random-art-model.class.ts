import {Canvas} from 'canvas';
import * as fs from 'fs';
import {new_new_picture, new_picture, compute_pixel} from './genjs5';

import {IncrementalPlotObserver} from '../interfaces';

class NumberHolder {
   public count: number;
}

export class RandomArtModel implements IncrementalPlotObserver
{
   // private readonly colorCount: Map<string|CanvasGradient|CanvasPattern, NumberHolder>;
   private readonly genModel: any;

   public constructor(
      public readonly prefix: number[], public readonly suffix: number[],
      public readonly novel: boolean = true,
      private readonly canvas: Canvas, private readonly context: CanvasRenderingContext2D)
   {
      if (novel) {
         // @ts-ignore
         this.genModel = new_new_picture(prefix, suffix);
      } else {
         // @ts-ignore
         this.genModel = new_picture(prefix, suffix);
      }

      // this.colorCount = new Map<string|CanvasGradient|CanvasPattern, NumberHolder>();
   }

   public onComplete(): void
   {
      const filePath = "temp2.png";
      console.log(`Entered stream writer for ${filePath}`);

         const out = fs.createWriteStream(filePath);
         const stream = this.canvas.createPNGStream();

            out.on('end', () => {
               console.log(`Saved png of ${out.bytesWritten} bytes to ${filePath}`);
               // resolve(taskContext.canvas);
            });

            stream.on('error', function (err: any) {
               console.error('Brap!', err);
               // reject(err);
               out.close();
            });

            stream.pipe(out);
   }

   public onError(error: any): void
   {
      console.error(error);
   }

   public plot(canvasX: number, canvasY: number, modelX: number, modelY: number): void
   {
      // @ts-ignore
      this.context.fillStyle = compute_pixel(this.genModel, modelX, modelY);
      // console.log(`<${canvasX}, ${canvasY}> @ ${this.context.fillStyle}`)
      this.context.fillRect(canvasX, canvasY, 1, 1);

      // if (this.colorCount.has(this.context.fillStyle)) {
      //    let countHolder: undefined|NumberHolder = this.colorCount.get(this.context.fillStyle);
      //    countHolder!.count++;
      //    if ((countHolder!.count % 40000) === 0) {
      //       console.log(`Counter for ${this.context.fillStyle} increments to ${countHolder!.count} at ${modelX}, ${modelY}`);
      //    }
      // } else {
      //    let countHolder: NumberHolder = new NumberHolder;
      //    countHolder.count = 1;
      //    this.colorCount.set(this.context.fillStyle, countHolder);
      //    console.log(`Encountered new pixel color, ${this.context.fillStyle} at ${modelX}, ${modelY}`);
      // }
   }
}

