import { BitInputStream } from '@thi.ng/bitstream';
import { co } from 'co';
import * as fs from 'fs';
import * as path from 'path';
import binarySearch from 'binary-search';

// @ts-ignore
import cs from 'co-stream';

import { BitStrategyKind, ModelSeedPolicy } from '../../config';
import { AbstractAsyncModelSeedStrategy } from './abstract-async-model-seed.strategy.class';

function naturalOrder(element: number, needle: number) { return element - needle; }

interface TrigramData {
   readonly trigrams: string[];
   readonly freqSum: number[];
   readonly prefixSum: number;
}

export class TrigramModelSeedStrategy extends AbstractAsyncModelSeedStrategy {
   private trigrams: Promise<TrigramData>;

   constructor(policyData: ModelSeedPolicy) {
      super(policyData);

      const trigrams: string[] = [];
      const freqSum: number[] = [];
      let prefixSum: number = 0;

      this.trigrams = co(function *() {
         let input = fs.createReadStream(
            path.join(__dirname, '../../../../../english_trigrams.txt')
         ),
            reader = new cs.LineReader(input),
            txt;

         while (typeof (txt = yield reader.read()) === 'string') {
            // console.log('line', txt);
            const tokens = txt.split(/ /);
            trigrams.push(tokens[0].toLowerCase());
            prefixSum += parseInt(tokens[1]);
            freqSum.push(prefixSum);
         }
      }).catch(function (err) {
         if (err) console.error(err);
         throw err;
      }).then(() => {
         return { trigrams, freqSum, prefixSum };
      })
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.trigrams;
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
}
