import {ConstructorFor} from 'simplytyped';
import {BlockHash} from '../hash.js';

declare module 'hmac-drbg'
{
   export class HmacDrbg
   {
      generate(len: number, enc: EncodingType, add: string, addEnc?: EncodingType): string;
      generate(len: number, add: string, addEnc?: EncodingType): string;
      generate(len: number): string;

      reseed(entropy: string, entropyEnc: EncodingType, add: string, addEnc?: EncodingType): string;
      reseed(entropy: string, add: string, addEnc?: EncodingType): string;
      reseed(entropy: string): void;
   }

   export type EncodingType = 'utf8' | 'ascii' | 'hex' | 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64';

   export interface HmacDrbgOptions<T>
   {
      hash: ConstructorFor<BlockHash<T>>
      entropy: string,
      entropyEnc?: EncodingType,
      nonce?: string,
      nonceEnc?: EncodingType,
      pers?: string,
      persEnc?: EncodingType,
      predResist?: boolean,
      minEntropy: number
   }
}

