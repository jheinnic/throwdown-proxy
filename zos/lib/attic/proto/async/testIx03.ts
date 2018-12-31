import {AsyncIterableX} from 'ix/asynciterable';
// import {IterableX} from 'ix/iterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/iterable/range';
import 'ix/add/asynciterable/range';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/memoize';
import 'ix/add/asynciterable-operators/takeuntil';
import 'ix/add/asynciterable-operators/take';
import 'ix/add/asynciterable-operators/repeat';
import 'ix/add/asynciterable-operators/flatmap';
import 'ix/add/asynciterable-operators/mergeall';
import 'ix/add/asynciterable-operators/share';
import 'ix/add/iterable-operators/publish';
import 'ix/add/iterable-operators/share';
import 'ix/add/iterable-operators/take';
import 'ix/add/iterable/repeat';
import 'ix/add/iterable-operators/flatten';
import 'ix/add/iterable-operators/flatmap';
import 'ix/add/asynciterable/asyncify';
import {AsyncSink} from 'ix';
import {go, sleep} from 'medium';
import {asyncScheduler, SchedulerAction} from 'rxjs';

let keep: number;
const aSequence: AsyncIterableX<number> = AsyncIterableX.range(1, 5000)
   .publish()
   .tap({ next: (value: number): void => { keep = value; } })
   .finally(() => {
      console.log('Fired!', keep);
      asyncSink.write(AsyncIterableX.of(keep));
   })
;

const asyncSink: AsyncSink<AsyncIterable<number>> =
   new AsyncSink<AsyncIterable<number>>();

const masterSequence = AsyncIterableX.from(asyncSink)
   .mergeAll()
   .share()
   .finally(() => {
      console.log('fin');
   })
;

go(async function () {
   let myNumber: number;
   for await (myNumber of masterSequence) {
      await sleep(Math.random() * 10);
      console.log(`Worker #1 has ${myNumber}`);
      await sleep(Math.random() * 20);
   }
})
   .then(console.log.bind(console))
   .catch(console.error.bind(console));

go(async function () {
   let myNumber: number;
   for await (myNumber of masterSequence) {
      await sleep(Math.random() * 10);
      console.log(`Worker #2 has ${myNumber}`);
      await sleep(Math.random() * 20);
   }
})
   .then(console.log.bind(console))
   .catch(console.error.bind(console));

go(async function () {
   let myNumber: number;
   for await (myNumber of masterSequence) {
      await sleep(Math.random() * 10);
      console.log(`Worker #3 has ${myNumber}`);
      await sleep(Math.random() * 20);
   }
})
   .then(console.log.bind(console))
   .catch(console.error.bind(console));

const pulseDelay: number = 750;
const paintDuration: number = 50;
console.log(asyncSink);

asyncScheduler.schedule(
   function (
      this: SchedulerAction<AsyncSink<AsyncIterable<number>>>,
      state?: AsyncSink<AsyncIterable<number>>): void
   {
      const self: SchedulerAction<AsyncSink<AsyncIterable<number>>> = this;

      if (!! state) {
         state.write(
            aSequence.takeUntil(function () {
               return new Promise((resolve) => {
                  setTimeout(
                     () => {
                        self.schedule(state!, pulseDelay);
                        resolve();
                     }, paintDuration);
               });
            })
         )
      } else {
         console.error('NO STATE!?');
      }
   }, pulseDelay, asyncSink);

