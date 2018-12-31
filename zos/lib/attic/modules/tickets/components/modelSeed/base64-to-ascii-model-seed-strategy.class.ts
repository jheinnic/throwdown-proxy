import {BitInputStream} from '@thi.ng/bitstream';
import {BitStrategyKind, ModelSeedPolicy} from '../../config';
import {AbstractModelSeedStrategy} from './abstract-model-seed.strategy.class';

export class Base64ToAsciiModelSeedStrategy extends AbstractModelSeedStrategy {
   constructor(policyData: ModelSeedPolicy) {
      super(policyData);
   }

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.base64ToAscii;
   }

   protected applyTransform(selectedBits: BitInputStream, bitsToUse: number): Uint8Array
   {
      let words = Math.floor((bitsToUse) / 8);
      let buf = Buffer.from(selectedBits.readWords(words, 8));

      buf = Buffer.from((buf as any).base64Slice(0), 'ascii');
      let wordBits = new BitInputStream(buf);

      return new Uint8Array(wordBits.readWords(buf.length, 8));
   }

}