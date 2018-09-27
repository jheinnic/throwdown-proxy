export interface IPseudoRandomSource
{
   pseudoRandomIntegers( minValue: number, maxValue: number): IterableIterator<number>

   pseudoRandomBuffers( byteCount: number ): IterableIterator<Buffer>
}
