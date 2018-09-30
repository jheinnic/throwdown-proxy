import {BitInputStream} from '@thi.ng/bitstream';
import {ec} from 'elliptic';
import {Chan, CLOSED, take, put, go} from 'medium';
import * as path from 'path';
import * as fs from 'fs';

import {NamedElement, BlockMappedDigestLocator, MerkleDigestLocator} from '../../../infrastructure/merkle';
// import {IPseudoRandomSource, IPseudoRandomSourceFactory, IsaacPseudoRandomSourceFactory} from '../../../infrastructure/randomize/index';
import {ITaskContentAdapter} from '../interfaces/task-content-adapter.interface';
import {Deployment} from '../../../apps/config';
import * as util from 'util';

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
   dirTree: IterableIterator<NamedElement<BlockMappedDigestLocator>>;
   pathIterOne: IterableIterator<NamedElement<MerkleDigestLocator>>;
   pathIterTwo: IterableIterator<NamedElement<MerkleDigestLocator>>;
   readAheadSize: number;
   outputRoot: string;
   firstGeneration?: number;
   variants: NamedVariant[];
   ecInst: ec;
}

export class EllipticPublicKeySource
{
   constructor(
      public readonly sourcePath: string,
      public readonly generationCounter: number,
      public readonly xBuffer: Buffer,
      public readonly yBuffer: Buffer)
   { }

   static fromBuffer(
      buffer: Buffer, sourcePath: string, generationCounter: number, genConfig: EllipticModelGenConfig): EllipticPublicKeySource
   {
      console.log(`Elliptic KeySource from ${buffer.toString(`hex`)}`);
      let keyPair = genConfig.ecInst.keyFromPublic(buffer, '16');
      let pubKey = keyPair.getPublic();
      let xBuffer = pubKey.x.toBuffer();
      let yBuffer = pubKey.y.toBuffer();
      return new EllipticPublicKeySource(
         sourcePath, generationCounter, xBuffer, yBuffer);
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

      let prefix: Uint8Array;
      let suffix: Uint8Array;
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


export class EllipticPublicKeyModelAdapter implements ITaskContentAdapter<EllipticPublicKeyModel>
{
   public convertToModelSeed(sourceContent: EllipticPublicKeyModel): [number[], number[]]
   {
      return [[...sourceContent.prefixBits], [...sourceContent.suffixBits]];
   }

   public convertToImagePath(sourceContent: EllipticPublicKeyModel, dimensionToken: string): string
   {
      return path.join(
         sourceContent.relativePath,
         sourceContent.nameExtension + '_' +
         sourceContent.generation.toString() + '-' +
         dimensionToken + '.png'
      );
   }

   public isNovelStrategy(sourceContent: EllipticPublicKeyModel): boolean
   {
      return sourceContent.novel;
   }
}

export class EllipticPublicKeyAsyncReadAhead
{
   constructor(
      public readonly genConfig: EllipticModelGenConfig,
      private readonly deployConfig: Deployment,
      private readonly channel: Chan<EllipticPublicKeySource>)
   { }

   start(): void {
      go(this.readAheadPublicKeys.bind(this)).then(
         (): void => {
            console.log('Returning from read-ahead component');
            return;
         }
      ).catch(
         (err: any) => {
            console.error('Error running thread read-ahead.  What now??', err);
         }
      );
   }

   public async readAheadPublicKeys()
   {
      let generation = !!this.genConfig.firstGeneration ? this.genConfig.firstGeneration : 1;

      for (let lotOfData of this.genConfig.pathIterTwo) {
         const keyBuffer: Buffer =
            await util.promisify(fs.readFile)(
               toPublicKeyFile(this.genConfig, this.deployConfig, lotOfData.name),
               { flag: 'r' }
            );
         const keySource: EllipticPublicKeySource =
            EllipticPublicKeySource.fromBuffer(
               keyBuffer, lotOfData.name, generation, this.genConfig);
         await put(this.channel, keySource);
         console.log(`Put ${keySource.sourcePath} on channel`);
      }
   }
}


export class EllipticPublicKeyModelGenerator implements Iterable<Promise<EllipticPublicKeyModel[]>>
{
   constructor(
      public readonly genConfig: EllipticModelGenConfig,
      private readonly channel: Chan<EllipticPublicKeySource>)
   { }

   public * [Symbol.iterator](): IterableIterator<Promise<EllipticPublicKeyModel[]>>
   {
      // let generation = !!this.genConfig.firstGeneration ? this.genConfig.firstGeneration : 1;
      for (let _ of this.genConfig.pathIterOne) {
         yield take(this.channel).then((keySource: EllipticPublicKeySource|CLOSED) => {
            if (keySource instanceof EllipticPublicKeySource) {
               let namedVariant: NamedVariant;
               const keyModels: EllipticPublicKeyModel[] = [];
               for (namedVariant of this.genConfig.variants) {
                  keyModels.push(keySource.applyVariant(namedVariant));
               }

               return keyModels;
            } else {
               return [];
            }
         });
      }
   }
}


// function toPrivateKeyFile(genModel: EllipticModelGenConfig, deployCfg: Deployment, pathName: string): string
// {
//    return path.join(
//       genModel.outputRoot,
//       deployCfg.dataSetPaths.ticketKeyPairs,
//       pathName + '_private.key');
// }

function toPublicKeyFile(genModel: EllipticModelGenConfig, deployCfg: Deployment, pathName: string): string
{
   return path.join(
      genModel.outputRoot,
      deployCfg.dataSetPaths.ticketKeyPairs,
      pathName + '_public.key');
}