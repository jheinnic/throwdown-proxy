import {inject, tagged} from 'inversify';
import {RANDOMIZE_TYPES} from '../di/index';
import {IReseedingPseudoRandomSource} from '../interface/reseeding-pseudo-random-source.interface';
import {PRNG_ALGORITHM_KINDS, RANDOMIZE_TAGS} from '../di/tags';
import {HmacDrbgSeed} from './hmac-drbg-seed.interface';
import HmacDrbg from 'hmac-drbg';

const INT32_OVERFLOW = Math.pow(2, 33);

   export class HmacDrbgPseudoRandomSource implements IReseedingPseudoRandomSource<Buffer>
{
   private readonly hmacDrbg: any; // HmacDrbg;

   constructor(
      @inject(RANDOMIZE_TYPES.SeedBytes) @tagged(
         RANDOMIZE_TAGS.PRNGAlgorithm, PRNG_ALGORITHM_KINDS['HMAC-DRBG']) seedBytes: HmacDrbgSeed
   )
   {
      this.hmacDrbg = new HmacDrbg({
         entropy: seedBytes.entropyWord.toString('16'),
         entropyEnc: 'hex',
         nonce: seedBytes.nonceWord.toString('16'),
         nonceEnc: 'hex'
         // add: [
         //
         // ],
         // addEnc: 'hex'
      });
   }

   public* pseudoRandomBuffers(byteCount: number): IterableIterator<Buffer>
   {
      while (true) {
         yield Buffer.from(
            this.hmacDrbg.bytes(byteCount)
         );
      }
   }

   public* pseudoRandomIntegers(minValue: number, maxValue: number): IterableIterator<number>
   {
      if (minValue >= maxValue) {
         throw new Error(`maxValue, ${maxValue}, must be at least one greater than minValue, ${minValue}`);
      }

      const range = maxValue - minValue;
      if (range > INT32_OVERFLOW) {
         throw new Error(
            `Can only ensure integers over a range no greater than ${INT32_OVERFLOW} wide, which excludes ${range}`);
      }

      while (true) {
         yield (
            (
               this.hmacDrbg.int32() % range
            ) + minValue
         );
      }
   }

}