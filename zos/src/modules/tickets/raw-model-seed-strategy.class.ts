import {BitStrategyKind, ModelSeedPolicy} from './config/index';
import {BitInputStream} from '@thi.ng/bitstream';
import {AbstractModelSeedStrategyClass} from './abstract-model-seed-strategy.class';

export class RawModelSeedStrategyClass extends AbstractModelSeedStrategyClass
{
   constructor(policyData: ModelSeedPolicy)
   {
      super(policyData);
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.raw;
   }

   protected applyTransform(selectedBits: BitInputStream, bitsToUse: number): Uint8Array
   {
      let xWords = Math.floor((
         bitsToUse
      ) / 8);
      return new Uint8Array(selectedBits.readWords(xWords, 8));
   }
}