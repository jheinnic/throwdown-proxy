import {BitInputStream} from '@thi.ng/bitstream';
import {BitStrategyKind, ModelSeedPolicy} from '../../config';
import {AbstractModelSeedStrategy} from './abstract-model-seed.strategy.class';

export class Mod160ModelSeedStrategy extends AbstractModelSeedStrategy {
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
         retVal[ii] = retVal[ii] % 116;
      }

      return retVal;
   }
}