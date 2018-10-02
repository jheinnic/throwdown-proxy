import {AsyncIterable, Iterable} from '@reactivex/ix-ts';
import {Injectable} from '@angular/core';
import {Chan} from 'medium';
import {Canvas} from 'canvas';

import {ITaskLoader, IRandomArtGenerator, ICanvasPoolManager} from '../interfaces/index';
import {CanvasPlotter, CanvasWriter} from './index';
import '../../../infrastructure/reflection';

@Injectable()
export class RandomArtGenerator implements IRandomArtGenerator
{
   private readonly stopSignal: Chan<void>;

   private readonly stopObservable: Iterable<void>;

   private readonly canvasSource: AsyncIterable<Canvas>;

   constructor(
      private readonly canvasProvider: ICanvasPoolManager,
      private readonly taskLoader: ITaskLoader,
      private readonly painter: CanvasPlotter,
      private readonly canvasWriter: CanvasWriter,
      private readonly stopSignal: Chan<void>)
   {
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

