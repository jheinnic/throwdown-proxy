import {OperatorFunction} from 'rxjs';

export interface RandomSourceInterface
{
   withRandomBytes<T>( bytesPerSeed: number ): OperatorFunction<T, [T, Buffer]>;
}
