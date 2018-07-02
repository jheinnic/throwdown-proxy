/**
 * A small sequence of binary data that can be represented as a series of unsigned 8-bit integers, a byte
 * Buffer, or a slightly modified Base64 encoded string.
 *
 * This class does not define the intended use for the binary data it encapsulates, but merely provides
 * storage and conversion facilities.
 *
 * The Base64 encoding is slightly modified because it replaces all occurrences of '/' with an underscore.
 * This single bit of artistic license is taken because one common use of this class's values will be to
 * generate filesystem names, where '/' is often reserved as a path separator.
 *
 */
export class GeneWord
{
  constructor(public readonly wordArray: Uint8Array, public readonly wordString: string) { }

  public static fromBuffer(buffer: Buffer): GeneWord
  {
    const wordArray = new Uint8Array(buffer);
    const wordString = (buffer as any).hexSlice();

    return new GeneWord(wordArray, wordString);
  }

  public static fromHex(wordString: string) {
    const wordArray = new Uint8Array(
      Buffer.from(wordString, 'hex')
    );

    return new GeneWord(wordArray, wordString);
  }
}
