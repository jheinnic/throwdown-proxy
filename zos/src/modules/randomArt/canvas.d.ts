import {Readable} from 'stream';

// declare namespace CanvasNames
declare module 'canvas'
{
      export type FillStyle = string | CanvasGradient | CanvasPattern;

      export interface PNGStream extends Readable
      {
         _read(): void;
      }

      export interface Context2D extends CanvasRenderingContext2D
      {
         patternQuality: string;
         filter: string;
         antialias: string;
      }

      export interface Canvas extends HTMLCanvasElement
      {
         /**
          * Gets or sets the height of a canvas element on a document.
          */
         height: number;

         /**
          * Gets or sets the width of a canvas element on a document.
          */
         width: number;

         pngStream: PNGStream;

         // constructor(width: number, height: number, type?: 'image'|'pdf'|'svg'): Canvas;

         createPNGStream(): PNGStream;

         streamPNGSync(): void;

         getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes): Context2D | null;

         getContext(
            contextId: 'webgl' | 'experimental-webgl', contextAttributes?: WebGLContextAttributes): null;

         getContext(contextId: string, contextAttributes?: {}): Context2D | null;

         getContext(
            contextId: '2d',
            contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;

         getContext(
            contextId: string,
            contextAttributes?: {}): CanvasRenderingContext2D | WebGLRenderingContext | null;

         toDataURL(type?: string, ...args: any[]): string;

         toBlob(callback: (result: Blob | null) => void, type?: string, ...arguments: any[]): void;
      }

   }




// declare module 'canvas'
// {
  // var Canvas: CanvasNames.Canvas;
  // export = Canvas;
  // export CanvasNames;
// }


// export as namespace Canvas;

// export = Canvas;

// export function Canvas(config?: string|{}): Canvas;

  // export class Canvas implements Canvas
  // {
  // /**
  //  * Gets or sets the height of a canvas element on a document.
  //  */
  //
  // height: number;
  //
  // /**
  //  * Gets or sets the width of a canvas element on a document.
  //  */
  // width: number;
  //
  // getContext(
  //   contextId: '2d', contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
  // getContext(
  //   contextId: string,
  //   contextAttributes?: {}): CanvasRenderingContext2D | WebGLRenderingContext | null;
  //
  //
  // toDataURL(type?: string, ...args: any[]): string;
  //
  // toBlob(callback: (result: Blob | null) => void, type?: string, ...arguments: any[]): void;
  //
  // constructor(width: number, height: number);
  // }
