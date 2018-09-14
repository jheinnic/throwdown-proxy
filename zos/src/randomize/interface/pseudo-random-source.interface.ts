import {Observable, OperatorFunction} from 'rxjs';

export interface PseudoRandomSource
{
   // sourceFloatingPoint( includePositive: boolean, includeNegative: boolean, valuesPerSeed: number ): OperatorFunction<Buffer, Observable<number>>

   withPseudoRandomInteger<T>( seedSource: Observable<Buffer>, minValue: number, maxValue: number): OperatorFunction<T, [T, number]>;

   withPseudoRandomBuffer<T>( seedSource: Observable<Buffer>, byteCount: number ): OperatorFunction<T, [T, Buffer]>;
}
