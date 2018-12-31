import {IReseedingRandomIterator} from './reseeding-random-iterator.interface';

export interface IReseedingPseudoRandomSource<T = undefined>
{
   pseudoRandomIntegers( minValue: number, maxValue: number): IReseedingRandomIterator<number, T>

   pseudoRandomBuffers( byteCount: number ): IReseedingRandomIterator<Buffer, T>
}
