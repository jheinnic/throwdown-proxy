import {BitInputStream} from '@thi.ng/bitstream';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
// @ts-ignore
import cs = require('co-stream');
import {co} from 'co';
import bs = require('binary-search');

import {BitStrategyKind, ModelSeedPolicy} from '../../config';
import {AbstractModelSeedStrategy} from './abstract-model-seed.strategy.class';

function naturalOrder(element: number, needle: number) { return element - needle; }

const trigrams: Promise<>
export class TrigramModelSeedStrategy extends AbstractModelSeedStrategy {
   private readonly trigrams: string[] = [];
   private readonly freqSum: number[] = [];
   private readonly prefixSum: number[] = [0];
   private on: boolean = false;

   constructor(policyData: ModelSeedPolicy) {
      super(policyData);
      var trigrams = this.trigrams;
      var freqSum = this.freqSum;
      var prefixSum = this.prefixSum;
      co(function *(this: TrigramModelSeedStrategy) {
         let input = fs.createReadStream(
            path.join(__dirname, '../../../../../english_trigrams.txt')
         ),
            reader = new cs.LineReader(input),
            txt;

         while (typeof (txt = yield reader.read()) === 'string') {
            console.log('line', txt);
            const tokens = txt.split(/ /);
            trigrams.push(tokens[0].toLowerCase());
            prefixSum[0] += parseInt(tokens[1]);
            freqSum.push(prefixSum[0]);
         }
      }).catch(function (err) {
         if (err) console.error(err);
      }).then(() => {
         this.on = true;
      })
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.raw;
   }


   protected applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Uint8Array
   {
      if (this.on === false) {
         return new Uint8Array(crypto.randomBytes(7));
      }
      const words = Math.floor(bitsToUse / 32);
      const sourceBits = new Uint32Array(selectedBytes.readWords(words, 32));
      const output = new Uint8Array(3*words);
      const scale = 1.0 * this.prefixSum[0] / ((1 << 32) - 1);
      for (let ii=0, jj=0; ii < words; ii++, jj+=3 ) {
         const nextP = Math.floor(sourceBits[ii] * scale);
         let pIdx = bs(this.freqSum, nextP, naturalOrder);
         if (pIdx < 0) {
            pIdx = -1 * (
               pIdx + 1
            );
         }
         const nextGram = this.trigrams[pIdx];
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
