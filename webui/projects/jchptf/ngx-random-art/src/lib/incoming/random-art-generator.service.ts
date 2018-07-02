import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/observeOn';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/single';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/windowCount';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
// import {Canvas, ICanvasProvider} from './canvas-consumer.interface';
// import {TaskLoader} from './task-loader.class';
// import {CanvasPlotter} from './canvas-plotter.service';
// import {CanvasWriter} from './canvas-writer.class';
import {AsyncSubject} from 'rxjs/AsyncSubject';

@Injectable({
  providedIn: 'root'
})
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
    this.stopObservable = this.stopSignal.share();

    const newCanvas: Canvas = this.canvasProvider.createNextCanvas(
      this.taskLoader.pixelWidth, this.taskLoader.pixelHeight
    );
    this.canvasSource = Observable.of(newCanvas);
  }

  public launchCanvas()
  {
    console.log('In launch canvas()');

    let subscription: Subscription;
    const abortSubscription = Observable.of(90000)
      .delayWhen(Observable.timer, this.stopObservable)
      .subscribe(
        () => { subscription.unsubscribe(); },
        (error: any) => { console.error(error); },
        () => { console.log('Abort watcher completes'); });

    subscription = this.canvasSource
    // .delayWhen(
    //   Observable.of, this.loopObservable
    // )
      .do(
        (freeCanvas: Canvas) => {console.log('Source was triggered for ', freeCanvas); }
      )
      .exhaustMap(
        (freeCanvas: Canvas) => {
          const taskWithModel =
            this.taskLoader.assignNextTask(freeCanvas);
          console.log(taskWithModel);

          return this.painter.paintThenEmit(taskWithModel)
            .do((value: number) => {
              console.log(
                `Observed a final reduction pass of ${value} for ${taskWithModel.genModel.novel} - ${taskWithModel.genModel.seedPhrase}`);
            })
            .concatMap((paintCount: number) =>
              this.canvasWriter.writeOutputFile({
                canvas: taskWithModel.canvas,
                outputFilePath: taskWithModel.outputFilePath
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
      )
      .repeatWhen(
        (notifications: Observable<any>) => notifications.takeUntil(this.stopObservable)
      )
      .do((post: any) => { console.log('Post-concat: ', post); })
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

