import {OperatorFunction} from 'rxjs';

export interface RandomSource
{
   withRandomBytes<T>( bytesPerSeed: number ): OperatorFunction<T, [T, Buffer]>;
}
