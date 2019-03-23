import { BitInputStream } from '@thi.ng/bitstream';
import { Chance } from 'chance';
import { co } from 'co';
import binarySearch from 'binary-search';
import ndarray from 'ndarray';
import * as fs from 'fs';
import * as path from 'path';

// @ts-ignore
import cs from 'co-stream';
// @ts-ignore
import HashRing from 'hashring';

function naturalOrder(element: number, needle: number) {
   return element - needle;
}

type Trigrams = {
   [K in string]: { weight: number }
}
export class TrigramModelSeedStrategy
{
   private ch: Chance.Chance;

   private trigrams: Promise<HashRing>;

   constructor() {
      const trigrams: Trigrams = {};
      // const freqSum: number[] = [];
      // const prefixSum: number = 0;

      this.trigrams = co(function *() {
         let input = fs.createReadStream(
            path.join(__dirname, '../../../../../english_trigrams.txt')
            ),
            reader = new cs.LineReader(input),
            txt;

         while (typeof (txt = yield reader.read()) === 'string') {
            console.log('line', txt);
            const tokens = txt.split(/ /);
            const weight = parseInt(tokens[1]);
            trigrams[tokens[0]] = { weight };
         }
      }).catch(function (err) {
         if (err) console.error(err);
         throw err;
      }).then(() => {
         return new HashRing(trigrams);
      });

      this.ch = new Chance();
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

   public rollWord(): string {
      const wordLen = Math.round(
         Math.max(
            3, this.ch.normal({mean: 5.5, dev: 1.5})
         )
      );

      return this.ch.word({ syllables: wordLen});
   }
}

export interface OuterSymbol {
    token: string;
    prefixTtl: number;
}

export interface ProbabilityState {
    advanceCdf: { cdf: number, steps: number }[];
    prefixDrainCdf: { cdf: number, drain: number }[];
    useCdfs: {
       wheel: number;
       prefix: number;
       suffix: number;
       drop: number;
    }[];
}

export class Sequence {
    constructor(
       public readonly wordSystem: WordSystem,
       public readonly symbolIndices: number[] )
    { }
}

export class WordSystem {
    public readonly symbolCount: number;
    public readonly tokenCount: number;
    public readonly genAffinity: ndarray<number>;

    constructor(
      public readonly outerSymbols: OuterSymbol[],
      public readonly suffixTokens: string[],
      public readonly suffixLength: number,
      public readonly initialPrefix: string,
      public readonly wheelProbability: ProbabilityState[],
      public readonly initialWheel: number,
      rawGenerationAffinity: number[] )
    {
        this.symbolCount = outerSymbols.length;
        this.tokenCount = suffixTokens.length;
        this.genAffinity = ndarray(rawGenerationAffinity);
    }
}

// export class Randomizer
// {
//     constructor( ) { }
//
//     public generateSequence(length: { mean: number, dev: number }): Sequence
//     {
//        return undefined;
//     }
// }

