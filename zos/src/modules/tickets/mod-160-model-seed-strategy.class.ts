import {BitStrategyKind, ModelSeedPolicy} from './config/index';
import {BitInputStream} from '@thi.ng/bitstream';
import {AbstractModelSeedStrategyClass} from './abstract-model-seed-strategy.class';

export class Mod160ModelSeedStrategyClass extends AbstractModelSeedStrategyClass {
   constructor(policyData: ModelSeedPolicy) {
      super(policyData);
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.mod160;
   }

   protected applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Uint8Array
   {
      const wordsToRead = Math.floor((bitsToUse) / 8);
      const retVal: Uint8Array =
         new Uint8Array(selectedBytes.readWords(wordsToRead, 8));
      for (let ii = 0; ii < wordsToRead; ii++) {
         retVal[ii] = retVal[ii] % 160;
      }

      return retVal;
   }
}