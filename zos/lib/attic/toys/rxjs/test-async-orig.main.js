const range = require('rxjs').range;
const AsyncObservableIterator = require('./async-iterator.class').AsyncObservableIterator;
require('./rxjs-to-async-iterator.js');

async function getIterator()
{
   const rxIter =
     new Promise((resolve, reject) => {
        const r = range(1, 20)
        resolve(new AsyncObservableIterator(r));
     });

   const asyncIter = await rxIter;
   // const iter = asyncIter.makeIter();
   // console.log('Testing');
   // console.log(iter.nextValue());
   // console.log(iter.nextValue());

   for (value of asyncIter) {
      // cb((err, value) => {
      //    if (!! err) {
      //       console.error(err);
      //    }
      //    if (!! value) {
            console.log('it is', value);
         // }
      // });
   }
}

getIterator().then((asyncIter) => { console.log('Resolved!'); });
