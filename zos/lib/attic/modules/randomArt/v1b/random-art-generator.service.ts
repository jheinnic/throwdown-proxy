import {AsyncIterable, Iterable} from 'ix';
import {AsyncSink} from 'ix';
import {defer, of} from 'rxjs';
import {share} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Chan} from 'medium';
import {Canvas} from 'canvas';

import {IRandomArtGenerator} from '../interface/index';
import {AssignCanvasRequest, WriteOutputTaskMessage} from '../messages/index';
import '../../../infrastructure/reflection/index';
import {TicketArtworkLocator} from '../../tickets/interface';

@Injectable()
export class RandomArtGenerator implements IRandomArtGenerator
{
   private readonly stopObservable: Iterable<void>;

   constructor(
      private readonly canvasProvider: AsyncIterable<Canvas>,
      private readonly taskLoader: IterableIterator<AssignCanvasRequest>,
      private readonly canvasWriter: AsyncSink<WriteOutputTaskMessage>,
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

   public enrollCanvas(worker: Canvas, renderTypes: string[]) {

   }

   public start(): void
   {
   }

   public stop(): void
   {
   }
}

function * manageOnePaintProcess(subject: TicketArtworkLocator, readLimitter, paintLimitter, writeLimitter) {

}

function * loadSeededModel(subject: TicketArtworkLocator) {
   subject.publicKeyPath
}