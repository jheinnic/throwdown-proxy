// declare namespace CanvasNames
declare module 'canvas'
{
   import 'canvas';
   import {Readable} from 'stream';

   export type FillStyle = string | CanvasGradient | CanvasPattern;

   export class PNGStream extends Readable
   {
      _read(): void;
   }

   export class Context2D extends CanvasRenderingContext2D
   {
      patternQuality: string;
      filter: string;
      antialias: string;
   }

   export interface MyCanvasRenderingContext2D extends CanvasRenderingContext2D
   {
      canvas: Canvas
      patternQuality: 'best';
      filter: 'best';
      antialias: 'subpixel';
   }

   export class Canvas extends HTMLCanvasElement
   {
      /**
       * Gets or sets the height of a canvas pathTo on a document.
       */
      height: number;

      /**
       * Gets or sets the width of a canvas pathTo on a document.
       */
      width: number;

      constructor (height: number, width: number, type?: 'image'|'pdf'|'svg');

      pngStream: PNGStream;

      createPNGStream(): PNGStream;

      streamPNGSync(): void;

      getContext(
         contextId: '2d',
         contextAttributes?: Canvas2DContextAttributes): MyCanvasRenderingContext2D | null;
      getContext(
         contextId: 'webgl' | 'experimental-webgl',
         contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;
      getContext(
         contextId: string,
         contextAttributes?: {}): MyCanvasRenderingContext2D | WebGLRenderingContext | null;

      toDataURL(type?: string, ...args: any[]): string;

      toBlob(callback: (result: Blob | null) => void, type?: string, ...arguments: any[]): void;
   }
}
