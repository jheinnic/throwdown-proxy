const Ix = require('ix');
const mapAsync = require('ix/iterable/mapAsync').mapAsync;
const co = require('co');
const wait = require('co-wait');
const Queue = require('co-priority-queue');
const limiter = require('@jchptf/co-limit').limiter;
const crypto = require('crypto');
const chan = require('chan');
const random = require('random');

let nCh1 = 0
let nCh2 = 0;

let rng = random.normal(250, 85);
function* coGen(chIn, chOut) {
   try {
      while (true) {
         input = yield chIn;
         nCh1--;
         // console.log(`\tWaiting to yield ${input}`);
         let interval = rng();
         while( interval < 0) {
            interval = rng();
         }
         yield wait(interval);
         console.log(`\tReady to yield ${input}`);
         nCh2++;
         yield chOut(input);
      }
   } catch(err) {
      console.error(err);
   }

   return 'DoneIt';
}

const coWrap = co.wrap(coGen);

const sinkOne = new Ix.AsyncSink();

let concurrent = 0;
let rnq = random.normal(600, 450);
function* coQueue(ch2) {
  // const myPromise = new Promise(function(resolve, reject) {
  //   sinkOne.write([input, resolve]);
  // });
  // return yield myPromise;
   let interval = rnq();
   while( interval < 0 ) {
      interval = rnq();
   }
   const value = yield ch2;
   nCh2--;
   concurrent++;
   console.log(`\t\t\tStart of final step for ${value} at ${nCh1} ${nCh2} ${concurrent} for ${interval}`);
   yield wait(interval);
   concurrent--;
   console.log(`\t\t\tEnd of final step for ${value} at ${nCh1} ${nCh2} ${concurrent} for ${interval}`);
   return value;
}

const limitSinkPool = limiter(12);
const limitSink = limitSinkPool(coQueue, 10);

function* src(ch1) {
  for( let ii = 0; ii < 5000; ii++ ) {
    console.log(`Generating input ${ii}`);
    nCh1++;
    yield ch1(ii);
    // console.log(`Ready to generate again!`);
  }
}

let yumII = 0;
function* feed(ch2) {
   while(true) {
      const yi = yumII++
      console.log('\t\tGotta feeeeeed: ', yi);
      yield limitSink(ch2);
      console.log('\t\tYummy: ', yi);
   }
}

// mapAsync(
// Ix.Iterable.from(gen()), x => coWrap(x))
//   .forEach(x => console.log(`Next ${x}`))
//   .catch(err => console.log(`Error ${err}`));

coWrapSource = co.wrap(src);
ch1 = chan(8);
ch2 = chan(14);


coWrapSource(ch1, ch2)
  .then(console.log).catch(console.error);
coWrap(ch1, ch2)
  .then(console.log).catch(console.error);

const wrapFeed = co.wrap(feed);

wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
wrapFeed(ch2)
  .then(console.log).catch(console.error);
