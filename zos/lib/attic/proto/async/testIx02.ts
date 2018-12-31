import {AsyncIterableX} from 'ix/asynciterable';
// import {IterableX} from 'ix/iterable';
import 'ix/add/asynciterable/create';
import 'ix/add/asynciterable/merge';
import 'ix/add/iterable/range';
import 'ix/add/asynciterable/range';
import 'ix/add/asynciterable/zip';
import 'ix/add/asynciterable-operators/map';
import 'ix/add/asynciterable-operators/memoize';
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

const aSequence: AsyncIterable<number> = AsyncIterableX.range(1, 50)
   // .publish()
   .finally(() => {
      console.log('bin');
   })
   .memoize()
   .finally(() => {
      console.log('min');
   })
;

const asyncSink: AsyncSink<AsyncIterable<number>> =
   new AsyncSink<AsyncIterable<number>>();

let count = 0;
const masterSequence = AsyncIterableX.from(asyncSink)
   .finally(() => {
      console.log('fin');
   })
   .mergeAll()
   .tap(
      {
         next: (value) => {
            if (value === 50) {
               if (count++ === 3) {
                  asyncSink.end();
               } else {
                  asyncSink.write(aSequence);
               }
            }
         }
      }
   )
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
      await sleep(Math.random() * 5);
   }
})
   .then(console.log.bind(console))
   .catch(console.error.bind(console));

go(async function () {
   let myNumber: number;
   for await (myNumber of masterSequence) {
      await sleep(Math.random() * 10);
      console.log(`Worker #2 has ${myNumber}`);
      await sleep(Math.random() * 5);
   }
})
   .then(console.log.bind(console))
   .catch(console.error.bind(console));

asyncSink.write(aSequence);

go(async function () {
   let myNumber: number;
   for await (myNumber of masterSequence) {
      await sleep(Math.random() * 10);
      console.log(`Worker #3 has ${myNumber}`);
      await sleep(Math.random() * 5);
   }
})
   .then(console.log.bind(console))
   .catch(console.error.bind(console));
