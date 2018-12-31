import {AsyncSubject, defer, Observable, of, Subscription, timer} from 'rxjs';
import {delayWhen, repeatWhen, share, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Canvas} from 'canvas';

import {ICanvasProvider, ITaskLoader, IRandomArtGenerator} from '../interfaces/index';
import {CanvasPlotter, CanvasWriter} from './index';
import '../../../../infrastructure/reflection/index';

@Injectable()
export class RandomArtGenerator implements IRandomArtGenerator
{
   private readonly stopSignal: AsyncSubject<any>;

   private readonly stopObservable: Observable<void>;

   private readonly canvasSource: Observable<Canvas>;

   constructor(
      private readonly canvasProvider: ICanvasProvider,
      private readonly taskLoader: ITaskLoader,
      private readonly painter: CanvasPlotter,
      private readonly canvasWriter: CanvasWriter)
   {
      // this.startSignal = new ReplaySubject<void>(1);
      this.stopSignal = new AsyncSubject<any>();

      // this.startObservable = this.startSignal.share();
      this.stopObservable = this.stopSignal.pipe(
         share());

      this.canvasSource = defer(
         () => of(
            this.canvasProvider.createNextCanvas(
               this.taskLoader.pixelWidth, this.taskLoader.pixelHeight
            )
         )
      );
   }

   public launchCanvas()
   {
      console.log('In launch canvas()');

      let subscription: Subscription;
      const abortSubscription = timer(5000)
         .pipe(
            delayWhen(of, this.stopObservable))
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
         this.taskLoader.assignNextTask(),
         this.painter.paintThenEmit(),
         this.canvasWriter.writeOutputFile(),

         tap((post: any) => { console.log('Pre-repeat: ', post); }),
         repeatWhen(
            takeUntil(this.stopObservable)
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

