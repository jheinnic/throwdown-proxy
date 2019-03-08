import { BitInputStream } from '@thi.ng/bitstream';
import { co } from 'co';
import binarySearch from 'binary-search';
import * as fs from 'fs';

// @ts-ignore
import cs from 'co-stream';
// @ts-ignore
import HashRing from 'hashring';

import { IAlphabetMapper } from './alphabet-mapper.interface';

type Trigrams = {
   [K in string]: { weight: number }
}

function naturalOrder(element: number, needle: number) {
   return element - needle;
}

// const trigrams : Promise<>
export abstract class AbstractAlphabetMapper implements IAlphabetMapper
{
   private trigrams: Promise<HashRing>;

   constructor(tokenList: string, scale: number = 1) {
      const trigrams: Trigrams = { };
      // const freqSum: number[] = [];
      // let prefixSum: number = 0;

      this.trigrams = co(function *() {
         let input = fs.createReadStream(tokenList),
            reader = new cs.LineReader(input),
            txt;

         while (typeof (txt = yield reader.read()) === 'string') {
            const tokens = txt.split(/ /);
            // trigrams.push(tokens[0].toLowerCase());
            // prefixSum += parseInt(tokens[1]);
            // freqSum.push(prefixSum);
            const weight = Math.ceil( parseInt(tokens[1]) / scale );
            trigrams[tokens[0]] = { weight };
         }
      }).catch(function (err) {
         if (err) console.error(err);
         throw err;
      }).then(() => {
         return new HashRing(trigrams)
      });
   }


   protected async applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Promise<Uint8Array>
   {
      const trigramData = await this.trigrams;
      const words = Math.floor(bitsToUse / 32);
      const sourceBits = new Uint32Array(selectedBytes.readWords(words, 32));
      const output = new Uint8Array(3*words);

      for (let ii=0, jj=0; ii < words; ii++, jj+=3 ) {
         const nextP = sourceBits[ii] % trigramData.prefixSum;
         // Unnecessary since sourceBits[ii] is an unsigned int.
         // if (nextP < 0) { nextP += trigramData.prefixSum; }
         let pIdx = binarySearch(trigramData.freqSum, nextP, naturalOrder);
         if (pIdx < 0) {
            pIdx = -1 * (
               pIdx + 1
            );
         }
         const nextGram = trigramData.trigrams[pIdx];
         output[jj] = nextGram.charCodeAt(0);
         output[jj+1] = nextGram.charCodeAt(1);
         output[jj+2] = nextGram.charCodeAt(2);

         if (jj === 0) {
            output[jj] = output[jj] - 32;
         }
      }

      return output;
   }

   public async mapToAlphabet(seed: string, length: number): Promise<string[]>
   {
      const hashRing = await this.trigrams;
      return hashRing.range(seed, length);
   }
}

