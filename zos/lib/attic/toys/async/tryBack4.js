const Ix = require('ix');
const co = require('co');
const wait = require('co-wait');
const Queue = require('co-priority-queue');
const limiter = require('@jchptf/co-limit').limiter;
const groupBy = require('ix/asynciterable/groupby').groupBy;
const toArray = require('ix/asynciterable/toarray').toArray;
const forkJoin = require('ix/asynciterable/forkjoin').forkJoin;

function* coGen(input) {
   console.log(`Waiting to yield ${input}`);
   yield wait(1500);
   console.log(`Ready to yield ${input}`);
   return input[0];
}

const coWrap = co.wrap(coGen);

const sinkOne = new Ix.AsyncSink();

function* coQueue(input) {
  const myPromise = new Promise(function(resolve, reject) {
    sinkOne.write([input, resolve]);
  });
  return yield myPromise;
}

const limitSinkPool = limiter(5);
const limitSink = limitSinkPool(coQueue, 10);

function* gen() {
  for( let ii = 0; ii < 50; ii++ ) {
    console.log(`Generating input ${ii}`);
    yield ii;
  }
}

const seqArr = 
toArray(
  groupBy(
    Ix.AsyncIterable.from(gen())
      .map((x, idx) => [idx, x]),
    pair => pair[0] % 5,
    pair => pair[1]
  )
  .map(g => g.map(x => coWrap(x)))
)

console.log(seqArr);
console.log(forkJoin);
seqArr.then( v => v.forkJoin
  .forEach(x => console.log(`Next ${x}`))
  .catch(err => console.log(`Error ${err}`)));

