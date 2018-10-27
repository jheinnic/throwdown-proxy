import {AsyncIterableX} from '@reactivex/ix-ts/asynciterable';
import {buffers, chan, Chan, take} from 'medium';
import {Subject, asyncScheduler} from 'rxjs';
import {subscribeOn} from 'rxjs/operators';
import {Canvas} from 'canvas';
import {AsyncSink} from '@reactivex/ix-ts';

const workerChannel: Chan = chan(buffers.fixed(4));

let stoppedFlag: boolean = false;

let stopSignal: Subject<void> = new Subject<void>();
stopSignal.asObservable().pipe(
   subscribeOn(asyncScheduler)
).subscribe(
   () => { console.log('On stop next'); stoppedFlag = true; },
   (err: any) => { console.error('On stop error', err); stoppedFlag = true; },
   () => { console.log('On stop complete.'); stoppedFlag = true; }
);

const workerSink: AsyncSink

async function* canvasProvider() {
   while (! stoppedFlag) {
      const freeCanvas: Canvas = await take(workerChannel);
      yield freeCanvas;
   }
}

AsyncIterableX.from(canvasProvider(), (canvas: Canvas) => canvas)
   .pipe()
