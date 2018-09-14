import {BitOutputStream} from "@thi.ng/bitstream";
// @ts-ignore
import isaac from "isaac";

export class UniqueValueSource implements Iterable<Buffer> {
   private wordSet: Set<string>;
   private seed: Uint32Array;
   private fullWords: number;
   private moduloBits: number;
   private moduloWord: number | boolean;
   private signed: boolean;

   constructor(seed: Uint32Array, bits: number, signed: boolean, wordSet: Set<string>) {
      this.wordSet = wordSet;
      this.seed = seed;
      this.fullWords = (bits >= 32) ? (bits / 32) : 0;
      this.moduloBits = (bits > (32 * this.fullWords)) ? (bits % 32) : 0;
      this.moduloWord = (this.moduloBits > 0) ? (Math.pow(2, this.moduloBits) + 1) : false;
      this.signed = signed;
   }

   [Symbol.iterator]()
   {
      return this.init();
   }

   * init(): Iterator<Buffer> {
      isaac.seed([...this.seed]);

      let buffer: Buffer|number;
      let word: string;

      if (! this.signed || (this.fullWords > 0)) {
         while (true) {
            do {
               buffer = this.generateNext();
               word = buffer.toString('base64');
            } while (this.wordSet.has(word));

            this.wordSet.add(word);
            yield buffer;
         }
      } else if (typeof(this.moduloWord) === 'number') {
         while (true) {
            do {
               buffer = isaac.rand() % this.moduloWord;
               word = buffer.toString();
            } while (this.wordSet.has(word));

            this.wordSet.add(word);
            yield Buffer.from([buffer]);
         }
      }
   }

   private generateNext(): Buffer {
      let bos = new BitOutputStream();

      for (let ii=0; ii<this.fullWords; ii++) {
         bos.writeWords([
           Math.abs(isaac.rand())
         ], 32)
      }

      if ( this.moduloBits > 0 ) {
         bos.writeWords([
            Math.abs(isaac.rand())
         ], this.moduloBits);
      }

      return Buffer.from(bos.bytes() as any);
   }
}
