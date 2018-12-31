const Ix = require('ix');
const co = require('co');
const wait = require('co-wait');
const Queue = require('co-priority-queue');
const limiter = require('@jchptf/co-limit').limiter;

function* coGen(input) {
   console.log(`Waiting to yield ${input[0]}`);
   yield wait(1500);
   console.log(`Ready to yield ${input[0]}`);
   input[1](input[0]);
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

async function* gen() {
  for( let ii = 0; ii < 1200; ii++ ) {
    console.log(`Generating input ${ii}`);
    yield ii;
  }
}

Ix.AsyncIterable.from(gen())
  .forEach(x => limitSink(x));
  // .forEach(x => sinkOne.write(x));

Ix.AsyncIterable.from(sinkOne)
  .map(x => coWrap(x))
  .forEach(x => console.log(`Next ${x}`))
  .catch(err => console.log(`Error ${err}`));

