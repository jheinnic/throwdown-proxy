import * as fs from 'fs';
// @ts-ignore
import {cs} from 'co-stream';
import {IsaacCSPRNG} from '../../../src/infrastructure/randomize/sources/index';
import bs = require('binary-search');
import {co} from 'co';

const trigrams: string[] = [];
const freqSum: number[] = [];
let prefixSum: number = 0;

function naturalOrder(element: number, needle: number) { return element - needle; }

co(function *() {
   let input = fs.createReadStream('../../english_trigrams.txt'),
      reader = new cs.LineReader(input),
      start = Date.now(),
      txt;

   while (typeof (txt = yield reader.read()) === 'string') {
      console.log('line', txt);
      const tokens = txt.split(/ /);
      trigrams.push(tokens[0]);
      prefixSum += parseInt(tokens[1]);
      freqSum.push(prefixSum);
   }

   console.log('done. %d lines, %d ms.', prefixSum, Date.now() - start);
}).catch(function (err) {
   if (err) console.log(err);
})
// const strm = fs.createReadStream('../../english_trigrams.txt')
//    .pipe(cs.split())
//    .pipe(cs.each(function* (line: string): IterableIterator<any> {
//       console.log('line');
//       const tokens = line.split(/ /);
//       trigrams.push(tokens[0]);
//       prefixSum += parseInt(tokens[1]);
//       freqSum.push(prefixSum);
//    }, {}));

.then( () => {
   console.log('Fin!');

   const foo: IsaacCSPRNG = new IsaacCSPRNG([93, 84, 891, 9227, 292, 19, 9283, 173, 842]);
   for (let ii = 0; ii < 1000; ii++) {
      let prefix = '';
      let suffix = '';
      for (let ii = 0; ii < 5; ii++) {
         const nextP = foo.int32() % prefixSum;
         let pIdx = bs(freqSum, nextP, naturalOrder);
         if (pIdx < 0) {
            pIdx = -1 * (
               pIdx + 1
            );
         }

         const nextS = foo.int32() % prefixSum;
         let sIdx = bs(freqSum, nextS, naturalOrder);
         if (sIdx < 0) {
            sIdx = -1 * (
               sIdx + 1
            );
         }

         prefix = prefix + trigrams[pIdx];
         suffix = suffix + trigrams[sIdx];
      }
      console.log(prefix + ' ' + suffix);
   }

   console.log(prefixSum);

   let length = trigrams.length;
   for (let ii = 0; ii < length; ii++) {
      fs.writeFileSync('trigram_prefix_sums.dat', `${trigrams[ii]} ${freqSum[ii]}\n`);
   }
});
