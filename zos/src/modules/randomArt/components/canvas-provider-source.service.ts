// @ts-ignore
import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {Chan, CLOSED, go, put, take} from 'medium';
import {Observable, OperatorFunction, Subject, zip} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {take as rxTake} from 'rxjs/operators';

export class CanvasProvider implements ICanvasProvider
{
   private shuttingDown: boolean = false;

   private ownedWorkers: Set<Canvas> = new Set<Canvas>();

   public constructor(
      private readonly returnChannel: Chan<Canvas>,
      private readonly canvasAvailableSubject: Subject<[Canvas, MyCanvasRenderingContext2D]>
   )
   { }

   public start()
   {
      const returnChannel = this.returnChannel;
      const canvasSubject = this.canvasAvailableSubject;
      const self = this;

      async function monitorChannel(): Promise<void>
      {
         const returnedCanvas: CLOSED | Canvas = await take(returnChannel)
         if (returnedCanvas instanceof Canvas) {
            if (!self.shuttingDown) {
               const paintContext = returnedCanvas.getContext('2d');
               if (!paintContext) {
                  throw new Error('Could not get 2D painting context');
               }

               paintContext.patternQuality = 'best';
               paintContext.filter = 'best';
               paintContext.antialias = 'subpixel';
               paintContext.clearRect(0, 0, returnedCanvas.width, returnedCanvas.height);
               paintContext.fillStyle = 'rgb(0,0,0)';
               paintContext.fillRect(0, 0, returnedCanvas.width, returnedCanvas.height);

               canvasSubject.next([returnedCanvas, paintContext]);
            }
         } else {
            // We received CLOSED, so do so.
            canvasSubject.complete();
         }
      }

      go(monitorChannel)
         .then(
            () => { console.log('Canvas Pool Manager shutting down'); },
            (err) => { console.error('Canvas Pool Manager faulted: ', err); });
   }

   public lease<T, R>(acceptFn: (val: T, canvas: Canvas) => R): OperatorFunction<T, R>
   {
      const returnChannel = this.returnChannel;

      return (source: Observable<T>): Observable<R> => {
         let myReturnCanvas: Canvas;

         return zip<R>(source, this.canvasAvailableSubject.asObservable())
            .pipe(
               rxTake<R>(1),
               map<any[], R>( (pair: any[]): R => {
                  myReturnCanvas = pair[1];
                  return acceptFn(pair[0] as T, pair[1] as Canvas);
               }),
               finalize((): void => {
                  put(returnChannel, myReturnCanvas).then(
                     () => { console.log('Canvas returned'); }
                  ).catch(
                     (err: any) => { console.error('Failed to return canvas: ', err); }
                  );
               })
            );
      }
   }

   public createNextCanvas(pixelWidth: number, pixelHeight: number): Canvas
   {
      const canvas = new Canvas(pixelWidth, pixelHeight, 'image');
      const paintContext = canvas.getContext('2d');
      if (!paintContext) {
         throw new Error('Could not get 2D painting context');
      }

      paintContext.patternQuality = 'best';
      paintContext.filter = 'best';
      paintContext.antialias = 'subpixel';

      this.ownedWorkers.add(canvas);
      this.canvasAvailableSubject.next([canvas, paintContext]);

      return canvas;
   }
}
