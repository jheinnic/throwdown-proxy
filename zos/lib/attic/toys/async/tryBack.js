const Ix = require('ix');
const co = require('co');
const wait = require('co-wait');
const Queue = require('co-priority-queue');
const limiter = require('@jchptf/co-limit');

function* coGen(input) {
   console.log(`Waiting to yield ${input}`);
   yield wait(1500);
   console.log(`Ready to yield ${input}`);
   return input;
}

const coWrap = co.wrap(coGen);

async function* gen() {
  for( let ii = 0; ii < 1200; ii++ ) {
    console.log(`Generating input ${ii}`);
    yield ii;
  }
}

Ix.AsyncIterable.from(gen())
  .map(x => coWrap(x))
  .forEach(x => console.log(`Next ${x}`))
  .catch(err => console.log(`Error ${err}`));

