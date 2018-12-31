import {BitInputStream} from '@thi.ng/bitstream';
import {BitStrategyKind, ModelSeedPolicy} from '../../config';
import {AbstractModelSeedStrategy} from './abstract-model-seed.strategy.class';

export class EightFromSevenModelSeedStrategy extends AbstractModelSeedStrategy {
   constructor(policyData: ModelSeedPolicy) {
      super(policyData);
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.get8From7;
   }


   protected applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Uint8Array
   {
      let words = Math.floor(bitsToUse / 7);
      return new Uint8Array(selectedBytes.readWords(words, 7));
   }
}