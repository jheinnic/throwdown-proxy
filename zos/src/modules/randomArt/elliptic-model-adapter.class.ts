import {TaskContentGenerator} from './task-content-generator.interface';
import {TaskContentAdapter} from './task-content-adapter.interface';

import {BitInputStream} from '@thi.ng/bitstream';
import {ec} from 'elliptic';
import * as path from 'path';
import * as fs from 'fs';

export enum BitStrategyKind
{
   raw = 'raw',
   base64ToAscii = 'base64ToAscii',
   mod128 = 'mod128',
   mod160 = 'mod160',
   get8From7 = 'get8From7'
}

export enum PrefixSelectStyle
{
   USE_X = 'USE_X',
   USE_Y = 'USE_Y'
}

export interface NamedVariant
{
   nameExtension: string;
   bitMode: BitStrategyKind;
   prefixSelect: PrefixSelectStyle;
   xRunsForward: boolean;
   yRunsForward: boolean;
   xFromBit: number;
   xToBit: number;
   yFromBit: number;
   yToBit: number;
   useNewModel: boolean;
}

export interface EllipticModelGenConfig
{
   keyPairRoot: string;
   outputRoot: string;
   pathIter: IterableIterator<string>
   ecInst: ec;
   variants: NamedVariant[];
   firstGeneration?: number;
}

export class EllipticPublicKeySource
{
   constructor(
      public readonly bits: Buffer,
      public readonly sourcePath: string,
      public readonly generationCounter: number
   )
   { }

   static fromBuffer(buffer: Buffer, sourcePath: string, generationCounter: number): EllipticPublicKeySource
   {
      return new EllipticPublicKeySource(buffer, sourcePath, generationCounter);
   }

   applyVariant(variant: NamedVariant): EllipticPublicKeyModel
   {
      const EC = ec;
      const ecInst = new EC('ed25519');
      let keyPair = ecInst.keyFromPublic(this.bits, '16');
      let pubKey = keyPair.getPublic();
      let xBuf = pubKey.x.toBuffer();
      let yBuf = pubKey.y.toBuffer();
      let xBits = new BitInputStream(xBuf);
      let yBits = new BitInputStream(yBuf);
      let xFrom = variant.xFromBit;
      let xTo = variant.xToBit;
      let yFrom = variant.yFromBit;
      let yTo = variant.yToBit;

      if (!variant.xRunsForward) {
         xBuf.reverse();
         xFrom = 256 - xFrom;
         xTo = 256 - xTo;
         xFrom += xTo;
         xTo = xFrom - xTo;
         xFrom = xFrom - xTo;
      }
      if (!variant.yRunsForward) {
         yBuf.reverse();
         yFrom = 256 - yFrom;
         yTo = 256 - yTo;
         yFrom += yTo;
         yTo = yFrom - yTo;
         yFrom = yFrom - yTo;
      }

      xBits.seek(xFrom);
      yBits.seek(yFrom);

      let prefix: Uint8Array;
      let suffix: Uint8Array;
      if (variant.bitMode === BitStrategyKind.get8From7) {
         let xWords = Math.floor((
            1 + xTo - xFrom
         ) / 7);
         let yWords = Math.floor((
            1 + yTo - yFrom
         ) / 7);

         if (variant.prefixSelect === PrefixSelectStyle.USE_X) {
            prefix = new Uint8Array(xBits.readWords(xWords, 7));
            suffix = new Uint8Array(yBits.readWords(yWords, 7));
         } else {
            prefix = new Uint8Array(yBits.readWords(yWords, 7));
            suffix = new Uint8Array(xBits.readWords(xWords, 7));
         }
      } else {
         let xWords = Math.floor((
            1 + xTo - xFrom
         ) / 8);
         let yWords = Math.floor((
            1 + yTo - yFrom
         ) / 8);

         if ((
            variant.bitMode === BitStrategyKind.mod128
            )
            || (
               variant.bitMode === BitStrategyKind.mod160
            ))
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

               xBits = new BitInputStream(xBuf);
               yBits = new BitInputStream(yBuf);
            }

            if (variant.prefixSelect === PrefixSelectStyle.USE_X) {
               prefix = new Uint8Array(xBits.readWords(xWords, 8));
               suffix = new Uint8Array(yBits.readWords(yWords, 8));
            } else {
               prefix = new Uint8Array(yBits.readWords(yWords, 8));
               suffix = new Uint8Array(xBits.readWords(xWords, 8));
            }
         }
      }

      return new EllipticPublicKeyModel(
         this.sourcePath,
         this.variantDef.nameExtension,
         prefix,
         suffix,
         true,
         this.generationCounter
      );
   }
}

export class EllipticPublicKeyModel
{
   constructor(
      public readonly relativePath: string,
      public readonly nameExtension: string,
      public readonly prefixBits: Uint8Array,
      public readonly suffixBits: Uint8Array,
      public readonly novel: boolean,
      public readonly generation: number)
   { }
}


export class EllipticPublicKeyModelAdapter extends TaskContentAdapter<EllipticPublicKeyModel>
{
   private readonly dimensionToken: string;

   public convertToModelString(sourceContent: EllipticPublicKeyModel): [number[], number[]]
   {
      return [[...sourceContent.prefixBits], [...sourceContent.suffixBits]];
   }

   public convertToImagePath(sourceContent: EllipticPublicKeyModel): string
   {
      return path.join(
         sourceContent.relativePath,
         sourceContent.nameExtension + '_' +
         sourceContent.generation.toString() + '-' +
         this.dimensionToken + '.png'
      );
   }

   public isNovelStrategy(sourceContent: EllipticPublicKeyModel): boolean
   {
      return sourceContent.novel;
   }
}

export class EllipticPublicKeyModelGenerator extends TaskContentGenerator<EllipticPublicKeyModel>
{
   constructor(public readonly genConfig: EllipticModelGenConfig)
   {
      super();
   }

   public async* [Symbol.asyncIterator](): AsyncIterableIterator<EllipticPublicKeyModel>
   {
      let generation = !!this.genConfig.firstGeneration ? this.genConfig.firstGeneration : 1;

      for (let keyFilePath of this.genConfig.pathIter) {
         // const promise: Promise<Buffer> =
         const keySource: EllipticPublicKeySource|void = await new Promise<Buffer>((resolve, reject) => {
            fs.readFile(
               path.join(this.genConfig.keyPairRoot, keyFilePath),
               {
                  encoding: 'binary',
                  flag: 'r'
               },
               (err: any, data: Buffer | string) => {
                  if (err) {
                     console.error(err);
                     reject(err);
                  } else if (data instanceof Buffer) {
                     resolve(data);
                  } else {
                     resolve(Buffer.from(data))
                  }
               }
            );
         }).then(
            (buffer: Buffer): EllipticPublicKeySource => {
               return EllipticPublicKeySource.fromBuffer(buffer, keyFilePath, generation);
            }
         ).catch(
            (error: any): void => {
               console.error(error);

               throw new Error(error);
            }
         );

         if (!!keySource) {
            for (const namedVariant of this.genConfig.variants) {
               yield keySource.applyVariant(namedVariant);
            }
            generation = generation + 1;
         } else {
            // TODO
         }

      }
   }
}

