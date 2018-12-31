import {BitInputStream} from '@thi.ng/bitstream';
import {BitStrategyKind, ModelSeedPolicy} from '../../config';
import {AbstractModelSeedStrategy} from './abstract-model-seed.strategy.class';

export class EightFromElevenModelSeedStrategy extends AbstractModelSeedStrategy {
   constructor(policyData: ModelSeedPolicy) {
      super(policyData);
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.get8From7;
   }


   protected applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Uint8Array
   {
      const words = Math.floor(bitsToUse / 11);
      const lilPart = new Uint8Array(selectedBytes.readWords(words, 5));
      const bigPart = new Uint8Array(selectedBytes.readWords(words, 6));
      for (let ii=0; ii < words; ii++ ) {
         bigPart[ii] = bigPart[ii] + lilPart[ii] + 32;
      }
      return bigPart;
   }
}