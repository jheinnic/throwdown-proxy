import {Observable, OperatorFunction} from 'rxjs';
import {map} from 'rxjs/operators';
import * as crypto from 'crypto';

import {PseudoRandomSource} from '../interface/pseudo-random-source.interface';

const INT32_OVERFLOW = Math.pow(2, 33);

export class NodeCryptoPseudoRandomSource implements PseudoRandomSource
{

   public withPseudoRandomBuffer<T>(
      _: Observable<Buffer>, byteCount: number): OperatorFunction<T, [T, Buffer]>
   {
      return function (source: Observable<T>): Observable<[T, Buffer]> {
         return source.pipe(
            map<T, [T, Buffer]>(
               function(trigger: T): [T, Buffer] {
                  return [trigger, crypto.pseudoRandomBytes(byteCount)];
               }
            )
         )
      }
   }

   public withPseudoRandomInteger<T>(
      _: Observable<Buffer>, minValue: number, maxValue: number): OperatorFunction<T, [T, number]>
   {
      if (minValue >= maxValue) {
         throw new Error(`maxValue, ${maxValue}, must be at least one greater than minValue, ${minValue}`);
      }

      const range = maxValue - minValue;
      if (range > INT32_OVERFLOW) {
         throw new Error(`Can only ensure integers over a range no greater than ${INT32_OVERFLOW} wide, which excludes ${range}`);
      }

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
   }
}
