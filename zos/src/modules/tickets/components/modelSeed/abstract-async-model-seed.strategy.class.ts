import { BitInputStream } from '@thi.ng/bitstream';

import { IPaintModelSeedStrategy } from '../../interface';
import { BitStrategyKind, ModelSeedPolicy, PrefixSelectStyle } from '../../config';
import { IModelSeed } from '../../../randomArt/interface/model';
import { Name } from '../../../../infrastructure/validation';

export abstract class AbstractAsyncModelSeedStrategy implements IPaintModelSeedStrategy {
   constructor(protected readonly policyData: ModelSeedPolicy) { }

   public get name(): Name {
      return this.policyData.name;
   }

   public abstract get strategyKind(): BitStrategyKind;

   public async extractSeed(publicKeyX: Buffer, publicKeyY: Buffer): Promise<IModelSeed>
   {
      let xBuffer: Buffer = Buffer.from(publicKeyX);
      let yBuffer: Buffer = Buffer.from(publicKeyY);

      let xFrom = this.policyData.xFromBit;
      let xTo = this.policyData.xToBit;
      let yFrom = this.policyData.yFromBit;
      let yTo = this.policyData.yToBit;

      if (!this.policyData.xRunsForward) {
         xBuffer.reverse();
         xFrom = 256 - xFrom;
         xTo = 256 - xTo;

         xFrom += xTo;
         xTo = xFrom - xTo;
         xFrom = xFrom - xTo;
      }
      if (!this.policyData.yRunsForward) {
         yBuffer.reverse();
         yFrom = 256 - yFrom;
         yTo = 256 - yTo;
         yFrom += yTo;
         yTo = yFrom - yTo;
         yFrom = yFrom - yTo;
      }

      let xBits = new BitInputStream(xBuffer);
      let yBits = new BitInputStream(yBuffer);
      xBits.seek(xFrom);
      yBits.seek(yFrom);

      let prefix: Uint8Array =
         (this.policyData.prefixSelect === PrefixSelectStyle.USE_X)
            ? await this.applyTransform(xBits, xTo - xFrom)
            : await this.applyTransform(yBits, yTo - yFrom);

      let suffix: Uint8Array =
         (this.policyData.prefixSelect === PrefixSelectStyle.USE_X)
            ? await this.applyTransform(yBits, yTo - yFrom)
            : await this.applyTransform(xBits, xTo - xFrom);

      return {
         prefixBits: prefix,
         suffixBits: suffix,
         novel: this.policyData.useNewModel
      };
   }

   protected abstract async applyTransform(selectedBytes: BitInputStream, bitsToUse: number): Promise<Uint8Array>;
}