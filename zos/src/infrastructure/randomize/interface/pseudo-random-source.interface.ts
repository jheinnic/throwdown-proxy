export interface IPseudoRandomSource
{
   pseudoRandomIntegers( minValue: number, maxValue: number): Iterable<number>

   pseudoRandomBuffers( byteCount: number ): Iterable<Buffer>
}
