import {BitInputStream} from '@thi.ng/bitstream';
import {BitStrategyKind, ModelSeedPolicy} from '../../config';
import {AbstractModelSeedStrategy} from './abstract-model-seed.strategy.class';

export class RawMappedModelSeedStrategy extends AbstractModelSeedStrategy {
   constructor(policyData: ModelSeedPolicy) {
      super(policyData);
   }

   private static byteMap = 'IuAesyntrNGnparhycWpcisPwfPToNetAIOdLaeErsrefhrarsgltitheeceBmhvahotoecflmHtiHsfdtusRnauHInuNtdlEDOrhaEitorareotogsiieuAeesrtLtoedmcithehenEviuhAarbsdoIreskhseTcDoenToWNnEOToWeiDfsnyNRaDiioseYtoDaneghUaTmpolesahWiEAlemtaoWIbosiekttntnAHrMYnfLLShlbeadEacgti';

   public get strategyKind(): BitStrategyKind
   {
      return BitStrategyKind.get8From7;
   }


   protected applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Uint8Array
   {
      const words = Math.floor(bitsToUse / 8);
      const sourceBits = new Uint8Array(selectedBytes.readWords(words, 8));
      for (let ii=0; ii < words; ii++ ) {
         sourceBits[ii] = RawMappedModelSeedStrategy.byteMap.charCodeAt(sourceBits[ii])
      }
      return sourceBits;
   }
}