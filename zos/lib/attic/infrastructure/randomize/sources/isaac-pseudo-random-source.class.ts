import {inject} from 'inversify';
import {BitOutputStream} from '@thi.ng/bitstream';

import {IsaacCSPRNG} from './isaac-csprng.class';
import {IPseudoRandomSource} from '../interface/index';
import {RANDOMIZE_TYPES} from '../di/index';

const INT32_OVERFLOW = Math.pow(2, 33);

export class IsaacPseudoRandomSource implements IPseudoRandomSource
{
   private readonly isaacCSPRNG: IsaacCSPRNG;

   constructor(
      @inject(RANDOMIZE_TYPES.SeedBytes) seedBytes: Buffer
   ) {
      // Isaac expects an array of 32-bit values as its input, so we have to convert every four
      // bytes of our Buffer to a concatenated integer.  This would likely be done more efficiently
      // by a for loop and calls to readUInt32BE() with 0, 4,...4(n-1), 4(n) as inputs, but it would
      // be slightly more error prone and this is one-time initialization...
      //
      // Round out to the nearest full 4-byte word, and discard any leftover seed.
      const wordCount: number = (seedBytes.length - (seedBytes.length % 4)) / 4;

      const writeBuf: BitOutputStream = new BitOutputStream();
      writeBuf.writeWords(seedBytes, 8);

      this.isaacCSPRNG = new IsaacCSPRNG(
         writeBuf.reader()
            .readWords(wordCount, 32));
   }

   public * pseudoRandomBuffers(byteCount: number): IterableIterator<Buffer>
   {
      while(true) {
         yield Buffer.from(
            this.isaacCSPRNG.bytes(byteCount).buffer
         );
      }
   }

   public * pseudoRandomIntegers(minValue: number, maxValue: number): IterableIterator<number>
   {
      if (minValue >= maxValue) {
         throw new Error(`maxValue, ${maxValue}, must be at least one greater than minValue, ${minValue}`);
      }

      const range = maxValue - minValue;
      if (range > INT32_OVERFLOW) {
         throw new Error(`Can only ensure integers over a range no greater than ${INT32_OVERFLOW} wide, which excludes ${range}`);
      }

      while(true) {
         yield ((this.isaacCSPRNG.int32() % range) + minValue);
      }
   }

}