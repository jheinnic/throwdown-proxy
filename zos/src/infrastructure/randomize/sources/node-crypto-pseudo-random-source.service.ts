import * as crypto from 'crypto';
import {IPseudoRandomSource} from '../interface';

const INT32_OVERFLOW = Math.pow(2, 33);

export class NodeCryptoPseudoRandomSource implements IPseudoRandomSource
{

   public* pseudoRandomBuffers(byteCount: number): IterableIterator<Buffer>
   {
      /*
      return function (source: Observable<T>): Observable<[T, Buffer]> {
         return source.pipe(
            map<T, [T, Buffer]>(
               function(trigger: T): [T, Buffer] {
                  return [trigger, crypto.pseudoRandomBytes(byteCount)];
               }
            )
         )
      }
      */
      while(true) {
         yield crypto.pseudoRandomBytes(byteCount);
      }
   }

   public* pseudoRandomIntegers(minValue: number, maxValue: number): IterableIterator<number>
   {
      if (minValue > maxValue) {
         throw new Error(`maxValue, ${maxValue}, must be at least as large as minValue, ${minValue}`);
      }

      const range = maxValue - minValue;
      if (range > INT32_OVERFLOW) {
         throw new Error(
            `Can only ensure integers over a range no greater than ${INT32_OVERFLOW} wide, which excludes ${range}`);
      }

      /*
      return function (source: Observable<T>): Observable<[T, number]> {
         return source.pipe(
            map<T, [T, number]>(
               function(trigger: T): [T, number] {
                  let nextResult = crypto.pseudoRandomBytes(4).readUInt32BE(0);
                  return [trigger, (nextResult % range) + minValue];
               }
            )
         );
      };
      */

      while (true) {
          let nextResult = crypto.pseudoRandomBytes(4).readUInt32BE(0);
          yield ((nextResult % range) + minValue);
      }
   }
}
