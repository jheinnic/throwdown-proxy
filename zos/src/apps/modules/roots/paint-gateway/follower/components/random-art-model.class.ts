import { Canvas } from 'canvas';
import { IterableX } from 'ix/iterable';
import { OperatorFunction } from 'ix/interfaces';
import { map } from 'ix/iterable/pipe/map';
import { startWith } from 'ix/iterable/pipe/startwith';

import {new_new_picture, new_picture, compute_pixel} from './genjs5';

import {
   CANVAS_X_COORD, CANVAS_Y_COORD, MODEL_X_COORD, MODEL_Y_COORD,
   IModelSeed, IncrementalPlotProgress, IRandomArtModel, MappedPoint,
} from '../interface';

/**
 * Strategy extension interfaces for implementing side effects to trigger during a walk of a
 * RandomArt model's rectangular region of interest, mapping each discrete pixel point from that
 * region's proportionally sized canvas grid to the floating point cartesian plane of a canonical
 * model region.
 *
 * The typical use of this interface is to feed model coordinates into a seeded artwork model,
 * extract pixel color information, and then use the canvas coordinates to place that pixel in an
 * image.
 *
 * Aside from the "workhorse" plot method, there are two methods used to signal the end of a call
 * sequence--one for completion with error, the other for normal end-of-data completion.
 */
export class RandomArtModel implements IRandomArtModel
{
   private readonly genModel: any;
   private readonly compute_pixel: (genModel: any, x: number, y: number) => string;

   public constructor(public readonly modelSeed: IModelSeed)
   {
      const prefix = [...modelSeed.prefixBits];
      const suffix = [...modelSeed.suffixBits];

      if (modelSeed.novel) {
         // @ts-ignore
         this.genModel = new_new_picture(prefix, suffix);
      } else {
         // @ts-ignore
         this.genModel = new_picture(prefix, suffix);
      }

      this.compute_pixel = compute_pixel; // .bind(this.genModel);
   }

   /*
   private _closed: boolean = false;

   public get closed(): boolean
   {
      return this._closed;
   }

   public complete(): void
   {
      const filePath = 'temp2.png';
      console.log(`Entered stream writer for ${filePath}`);

         const out = fs.createWriteStream(filePath);
         const stream = this.canvas.createPNGStream();

            out.on('end', () => {
               console.log(`Saved png of ${out.bytesWritten} bytes to ${filePath}`);
               // resolve(taskContext.canvas);
               this._closed = true;
            });

            stream.on('error', function (err: any) {
               console.error('Brap!', err);
               // reject(err);
               out.close();
            });

            stream.pipe(out);
   }
   */

   /**
    * Caller is responsible for ensuring that canvas size has been set to match the
    * range of mapped points, for spacing mapped points in units of pixelMulti, and
    * for batching the points into a number of arrays as defined by sliceCount.
    *
    * @param canvas
    * @param sliceCount
    * @param pixelMulti
    */
   public plot(
      canvas: Canvas, sliceCount: number = 1, pixelMulti: number = 1
   ): OperatorFunction<MappedPoint[], IncrementalPlotProgress>
   {
      // const canvas: Canvas = canvasAdapter.unwrap();
      const context = canvas.getContext('2d')!;
      if (context === null) {
         throw new Error('Canvas failed to return a 2D context object?');
      }
      RandomArtModel.clearImage(canvas, context);

      return (source: Iterable<MappedPoint[]>) => {
         return IterableX.as(source).pipe(
            map( (points: MappedPoint[], index: number) => {
               points.forEach((value: MappedPoint) => {
                  try {
                     context.fillStyle =
                        this.compute_pixel(
                           this.genModel, value[MODEL_X_COORD], value[MODEL_Y_COORD]);
                     context.fillRect(
                        value[CANVAS_X_COORD], value[CANVAS_Y_COORD], pixelMulti, pixelMulti);
                  } catch (err) {
                     console.error(err);
                     throw err;
                  }
               });
               index += 1;

               return {
                  modelSeed: this.modelSeed,
                  canvas: canvas,
                  done: index,
                  remaining: sliceCount - index,
                  total: sliceCount
               };
            }),
            startWith({
               modelSeed: this.modelSeed,
               canvas: canvas,
               done: 0,
               remaining: sliceCount,
               total: sliceCount
            })
         );
      }
   }

   private static clearImage(canvas: Canvas, context: CanvasRenderingContext2D): void
   {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
   }
}

