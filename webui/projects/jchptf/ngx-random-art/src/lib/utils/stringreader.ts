import * as util from 'util';
import {Stream} from 'stream';
import {Buffer} from 'buffer';

/**
 * A Readable stream for a string or Buffer.
 *
 * This works for both strings and Buffers.
 */
export class StringReader extends Stream {
  private encoding: string;

  constructor (private data: string|Buffer) {
    super();
  }

  open(): void {
    if (this.encoding && Buffer.isBuffer(this.data)) {
      this.emit('data', this.data.toString(this.encoding));
    } else {
      this.emit('data', this.data);
    }
    this.emit('end');
    this.emit('close');
  }

  public setEncoding(encoding: string): void {
    this.encoding = encoding;
  }

  pause(): void {
  }

  destroy(): void {
    this.data = undefined;
    delete this.data;
  }
}
