export interface IRandomSource
{
   randomBytes( bufferSize: number ): AsyncIterable<Buffer>;
}
