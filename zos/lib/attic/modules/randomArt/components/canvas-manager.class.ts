import {Canvas, PNGStream} from 'canvas';
import {AsyncSink} from 'ix/asyncsink';

import {UUID} from '../../../infrastructure';
import {ICanvasManager} from '../interface';
import {CanvasDimensions} from '../messages';

export class CanvasManager implements ICanvasManager
{
   private reserved: boolean;

   private context: CanvasRenderingContext2D | null;

   constructor(
      private readonly canvas: Canvas,
      private readonly releaseSink: AsyncSink<CanvasManager>,
      private readonly canvasId: UUID)
   {
      console.log('Created canvas manager ' + this.canvasId);
      this.reserved = false;
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      setTimeout(() => {
         this.releaseSink.write(this);
      }, 0);
   }

   public reserve(): UUID
   {
      if (this.reserved) {
         throw new Error('Not available!');
      }
      this.reserved = true;

      return this.canvasId;
   }

   public release(): void
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      this.reserved = false;
      this.releaseSink.write(this);
   }

   public isReserved(): UUID | false
   {
      return this.reserved ? this.canvasId : false;
   }

   public clearImage(): void
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      if (!this.context) {
         throw new Error('Context must include a completed piece of artwork');
      }
      this.context.fillStyle = '#000000';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

   public getPngStream(): PNGStream
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      return this.canvas.createPNGStream();
   }

   public getSize(): CanvasDimensions
   {
      // TODO: Use LRU?
      return {
         pixelWidth: this.canvas.width,
         pixelHeight: this.canvas.height
      };
   }

   public paintPixel(xCoord: number, yCoord: number, fillStyle: string): void
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      this.context!.fillStyle = fillStyle;
      this.context!.fillRect(xCoord, yCoord, 1, 1);
   }

   public resetImage(xCoord: number, yCoord: number): void
   {
      if (!this.reserved) {
         throw new Error('Not reserved!');
      }
      this.canvas.width = xCoord;
      this.canvas.height = yCoord;
   }
}
