const Ix = require('ix');
const mapAsync = require('ix/iterable/mapAsync').mapAsync;
const co = require('co');
const wait = require('co-wait');
const Queue = require('co-priority-queue');
const limiter = require('@jchptf/co-limit').limiter;
const crypto = require('crypto');


function* coGen(input) {
   console.log(`Waiting to yield ${input}`);
   yield wait(1500);
   console.log(`Ready to yield ${input}`);
   return input;
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
  for( let ii = 0; ii < 1200; ii++ ) {
    console.log(`Generating input ${ii}`);
    yield ii;
  }
}

mapAsync(
Ix.Iterable.from(gen()), x => coWrap(x))
  .forEach(x => console.log(`Next ${x}`))
  .catch(err => console.log(`Error ${err}`));

