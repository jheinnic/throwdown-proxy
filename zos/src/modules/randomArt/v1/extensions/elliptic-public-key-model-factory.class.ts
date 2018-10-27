import {BitInputStream} from '@thi.ng/bitstream';
import {ec} from 'elliptic';
import {EllipticPublicKeyModel} from './elliptic-public-key-model.class';
import {NamedVariant} from './config/named-variant.value';
import {BitStrategyKind} from './config/bit-strategy-kind.enum';
import {PrefixSelectStyle} from './config/prefix-select-style.enum';


export class EllipticPublicKeyModelFactory
{
   constructor(
      public readonly sourcePath: string,
      public readonly xBuffer: Buffer,
      public readonly yBuffer: Buffer)
   { }

   static fromBuffer(
      buffer: Buffer, sourcePath: string, ecInst: ec): EllipticPublicKeySource
   {
      // console.log(`Elliptic KeySource from ${buffer.toString(`hex`)}`);
      let keyPair = ecInst.keyFromPublic(buffer, '16');
      let pubKey = keyPair.getPublic();
      let xBuffer = pubKey.x.toBuffer();
      let yBuffer = pubKey.y.toBuffer();
      return new EllipticPublicKeySource(sourcePath, xBuffer, yBuffer);
   }

   applyVariant(variant: NamedVariant): EllipticPublicKeyModel
   {
      let xFrom = variant.xFromBit;
      let xTo = variant.xToBit;
      let yFrom = variant.yFromBit;
      let yTo = variant.yToBit;

      if (!variant.xRunsForward) {
         this.xBuffer.reverse();
         xFrom = 256 - xFrom;
         xTo = 256 - xTo;

         xFrom += xTo;
         xTo = xFrom - xTo;
         xFrom = xFrom - xTo;
      }
      if (!variant.yRunsForward) {
         this.yBuffer.reverse();
         yFrom = 256 - yFrom;
         yTo = 256 - yTo;
         yFrom += yTo;
         yTo = yFrom - yTo;
         yFrom = yFrom - yTo;
      }

      let xBits = new BitInputStream(this.xBuffer);
      let yBits = new BitInputStream(this.yBuffer);
      xBits.seek(xFrom);
      yBits.seek(yFrom);

      let prefix: Uint8Array = new Uint8Array(0);
      let suffix: Uint8Array = new Uint8Array(0);
      if (variant.bitMode === BitStrategyKind.get8From7) {
         let xWords = Math.floor((
            1 + xTo - xFrom
         ) / 7);
         let yWords = Math.floor((
            1 + yTo - yFrom
         ) / 7);

         // console.log(`xWords=${xWords}, yWords=${yWords}, xTo=${xTo}, yTo=${yTo}, xFrom=${xFrom}, yFrom=${yFrom}, xBuf=${this.xBuffer.hexSlice(0)}, yBuf=${this.yBuffer.hexSlice(0)}`);
         try {
            if (variant.prefixSelect === PrefixSelectStyle.USE_X) {
               prefix = new Uint8Array(xBits.readWords(xWords, 7));
               suffix = new Uint8Array(yBits.readWords(yWords, 7));
            } else {
               prefix = new Uint8Array(yBits.readWords(yWords, 7));
               suffix = new Uint8Array(xBits.readWords(xWords, 7));
            }
         } catch(err) {
            console.log(err);
         }
      } else {
         let xWords = Math.floor((1 + xTo - xFrom) / 8);
         let yWords = Math.floor((1 + yTo - yFrom) / 8);

         if ((variant.bitMode === BitStrategyKind.mod128)
            || (variant.bitMode === BitStrategyKind.mod160))
         {
            let modCap: number;
            if (variant.bitMode === BitStrategyKind.mod128) {
               modCap = 128;
            } else {
               modCap = 160;
            }

            let preWords: number;
            let sufWords: number;
            if (variant.prefixSelect === PrefixSelectStyle.USE_X) {
               prefix = new Uint8Array(xBits.readWords(xWords, 8));
               suffix = new Uint8Array(yBits.readWords(yWords, 8));
               preWords = xWords;
               sufWords = yWords;
            } else {
               prefix = new Uint8Array(yBits.readWords(yWords, 8));
               suffix = new Uint8Array(xBits.readWords(xWords, 8));
               preWords = yWords;
               sufWords = xWords;
            }

            for (let ii = 0; ii < preWords; ii++) {
               prefix[ii] = prefix[ii] % modCap;
            }

            for (let ii = 0; ii < sufWords; ii++) {
               suffix[ii] = suffix[ii] % modCap;
            }
         } else {
            // base64ToAscii uses these to provide access to a derived array without affecting
            // the original input.  Raw access doesn't modify the buffer and so leaves these
            // pointing to xBits and yBits.
            let xWordBits = xBits;
            let yWordBits = yBits;

            if (variant.bitMode === BitStrategyKind.base64ToAscii) {
               let xBuf = Buffer.from(xBits.readWords(xWords, 8));
               let yBuf = Buffer.from(yBits.readWords(yWords, 8));

               xBuf = Buffer.from((
                  xBuf as any
               ).base64Slice(0), 'ascii');
               yBuf = Buffer.from((
                  yBuf as any
               ).base64Slice(0), 'ascii');

               xWords = xBuf.length;
               yWords = yBuf.length;

               xWordBits = new BitInputStream(xBuf);
               yWordBits = new BitInputStream(yBuf);
            }

            if (variant.prefixSelect === PrefixSelectStyle.USE_X) {
               prefix = new Uint8Array(xWordBits.readWords(xWords, 8));
               suffix = new Uint8Array(yWordBits.readWords(yWords, 8));
            } else {
               prefix = new Uint8Array(yWordBits.readWords(yWords, 8));
               suffix = new Uint8Array(xWordBits.readWords(xWords, 8));
            }
         }
      }

      return new EllipticPublicKeyModel(
         this.sourcePath,
         variant.nameExtension,
         prefix,
         suffix,
         true
      );
   }
}
