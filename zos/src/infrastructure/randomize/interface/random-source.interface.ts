export interface IRandomGenerator
{
   randomBytes( bufferSize: number ): IterableIterator<Promise<Buffer>>
}
