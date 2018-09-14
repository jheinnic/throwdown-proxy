import {MonoTypeOperatorFunction} from '../../node_modules/rxjs/src/internal/types';
import * as isaac from 'isaac';
import * as crypto from 'crypto';

export function filterPercentOperator<T>(pct: number): MonoTypeOperatorFunction {
   isaac.seed([ ...Uint32Array.from(
     crypto.randomBytes(32 * 256)
   )]);
   return filter((value: T, index: number): boolean => {
      if (isaac.random() <= pct) { return true; }

      return false;
   })
}

export function filterKfromN(k: number, n: number): MonoTypeOperatorFunction {
   return filterPercentOperator((1.0 * k) / (1.0 * n));
}