const range = require('rxjs').range;
const interval = require('rxjs').interval;
const take = require('rxjs/operators').take;
const AsyncObservableIterator = require('./async-iterator.class').AsyncObservableIterator;
require('./rxjs-to-async-iterator.js');

async function getRangeIterator()
{
   const rxIter =
     new Promise((resolve, reject) => {
        const r = range(1, 20)
        resolve(new AsyncObservableIterator(r));
     });

   const asyncIter = await rxIter;

   for (value of asyncIter) {
      console.log('it is', value);
   }
}

async function getIntervalIterator()
{
   const rxIter =
     new Promise((resolve, reject) => {
        const r = interval(120).pipe(take(20));
        resolve(new AsyncObservableIterator(r));
     });

   const asyncIter = await rxIter;

   for (value of asyncIter) {
      console.log('it is', value);
   }
}

getRangeIterator()
  .then((asyncIterOne) => {
     console.log('Range Resolved!');
     getIntervalIterator()
       .then((asyncIterTwo) => {
          console.log('Interval Resolved!');
       });

  });
