 import {Injectable} from '@angular/core';

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
@Injectable({
  providedIn: 'root'
})
export class EncodingUtilityService
{
  constructor() { }

  public bufferFromPathElement(pathElement: string): Buffer
  {
    return Buffer.from(pathElement.replace('_', '\/'), 'base64');
  }

  public bufferFromBase64(base64: string): Buffer
  {
    return Buffer.from(base64, 'base64');
  }

  public base64FromBuffer(buffer: Buffer): string {
    return (buffer as any).base64Slice();
  }

  public pathElementFromBuffer(buffer: Buffer): string {
    return (buffer as any).base64Slice().replace('\/', '_');
  }

  public uint8ArrayFromBuffer(buffer: Buffer): Uint8Array {
    return new Uint8Array(buffer);
  }
}
