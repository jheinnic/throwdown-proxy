const range = require('rxjs').range;
const interval = require('rxjs').interval;
const take = require('rxjs/operators').take;
const AsyncObservableIterator = require('./async-iterator.class').AsyncObservableIterator;

async function getRangeIterator()
{
   const rxIter =
     new Promise((resolve, reject) => {
        const r = range(1, 20);
        resolve(new AsyncObservableIterator(r));
     });

   const asyncIter = await rxIter;
   // const iter = asyncIter.makeIter();
   // console.log('Testing');
   // console.log(iter.nextValue());
   // console.log(iter.nextValue());

   for (cb of asyncIter) {
      console.log(cb);
      cb((err, value) => {
         if (!!err) {
            console.error(err);
         }
         if (!!value) {
            console.log('range:', value);
         }
      });
   }
}

async function getIntervalIterator()
{
   const rxIter =
     new Promise((resolve, reject) => {
        const r = interval(100)
          .pipe(take(20));
        resolve(new AsyncObservableIterator(r));
     });

   const asyncIter = await rxIter;
   // const iter = asyncIter.makeIter();
   // console.log('Testing');
   // console.log(iter.nextValue());
   // console.log(iter.nextValue());

   for (cb of asyncIter) {
      console.log(cb);
      cb((err, value) => {
         if (!!err) {
            console.error(err);
         }
         if (!!value) {
            console.log('interval:', value);
         }
      });
   }
}

getRangeIterator()
  .then((asyncIterOne) => {
     console.log('Range Resolved!');

     // getIntervalIterator()
     //   .then((asyncIterTwo) => {
     //      console.log('Interval Resolved!');
     //   });
  });
