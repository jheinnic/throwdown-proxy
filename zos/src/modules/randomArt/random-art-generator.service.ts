import {Injectable} from '@angular/core';
import {AsyncSubject, Observable, of, Subscription, timer} from 'rxjs';
import {Canvas, ICanvasProvider} from './canvas-consumer.interface';
import {TaskLoader} from './task-loader.class';
import {CanvasPlotter} from './canvas-plotter.service';
import {CanvasWriter} from './canvas-writer.class';
import {delayWhen, exhaustMap, map, repeatWhen, share, takeUntil, tap} from 'rxjs/operators';

require('reflect-metadata');

@Injectable()
export class RandomArtGenerator
{
   private readonly stopSignal: AsyncSubject<any>;

   private readonly stopObservable: Observable<void>;

   private readonly canvasSource: Observable<Canvas>;

   constructor(
      private readonly canvasProvider: ICanvasProvider,
      private readonly taskLoader: TaskLoader<any>,
      private readonly painter: CanvasPlotter,
      private readonly canvasWriter: CanvasWriter)
   {
      // this.startSignal = new ReplaySubject<void>(1);
      this.stopSignal = new AsyncSubject<any>();

      // this.startObservable = this.startSignal.share();
      this.stopObservable = this.stopSignal.pipe(
         share());

      const newCanvas: Canvas = this.canvasProvider.createNextCanvas(
         this.taskLoader.pixelWidth, this.taskLoader.pixelHeight
      );
      this.canvasSource = of(newCanvas);
   }

   public launchCanvas()
   {
      console.log('In launch canvas()');

      let subscription: Subscription;
      const abortSubscription = of(90000)
         .pipe(
            delayWhen(
               () => timer(5000), this.stopObservable))
         .subscribe(
            () => { subscription.unsubscribe(); },
            (error: any) => { console.error(error); },
            () => { console.log('Abort watcher completes'); });

      subscription = this.canvasSource.pipe(
         // .delayWhen(
         //   Observable.of, this.loopObservable
         // )
         tap(
            (freeCanvas: Canvas) => {console.log('Source was triggered for ', freeCanvas); }
         ),
         exhaustMap(
            (freeCanvas: Canvas) => {
               const taskWithModel =
                  this.taskLoader.assignNextTask(freeCanvas);
               console.log(taskWithModel);

               return this.painter.paintThenEmit(taskWithModel)
                  .pipe(
                     tap((value: number) => {
                        console.log(
                           `Observed a final reduction pass of ${value} for ${taskWithModel.genModel.novel} - ${taskWithModel.genModel.seedPhrase}`);
                     }),
                     map((paintCount: number) => {
                        console.log('Painted ' + paintCount);
                        this.canvasWriter.writeOutputFile({
                           canvas: taskWithModel.canvas,
                           outputFilePath: taskWithModel.outputFilePath
                        });
                     })
                  );

               // return Observable.defer(
               //   () => this.canvasWriter.writeOutputFile({
               //     canvas: taskWithModel.canvas,
               //     outputFilePath: taskWithModel.outputFilePath
               //   })
               // )
               //   .delayWhen(
               //     Observable.of,
               //     this.painter.paintThenEmit(taskWithModel)
               //       .do((value: number) => {
               //         console.log(`Observed a final reduction pass of ${value} for
               // ${taskWithModel.genModel.seedPhrase}`); }) );
            }
         ),
         repeatWhen(
            (notifications: Observable<any>) => notifications.pipe(takeUntil(this.stopObservable))
         ),
         tap((post: any) => { console.log('Post-concat: ', post); }))
      // .multicast(() => this.loopSignal) // .refCount()
         .subscribe(
            () => {
               console.log('Observed recycling of canvas on completion of a painting task');
            },
            (error: any) => { console.error(error); },
            () => { abortSubscription.unsubscribe(); }
         );
   }

   public shutdownCanvas()
   {
      this.stopSignal.next(undefined);
   }
}

