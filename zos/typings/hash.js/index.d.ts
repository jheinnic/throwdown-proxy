declare module 'hash.js'
{
   import 'hash.js';

   export interface BlockHash<T>
   {
      hmacStrength: number
      padLength: number
      endian: 'big' | 'little'
   }

   export interface MessageDigest<T>
   {
      blockSize: number
      outSize: number

      update(msg: any, enc?: 'hex'): T

      digest(enc?: 'hex'): T
   }

   export interface Hash
   {
      hmac: HmacConstructor
      ripemd: RipemdSet
      ripemd160: Ripemd160Constructor
      sha: ShaSet
      sha1: Sha1Constructor
      sha224: Sha224Constructor
      sha256: Sha256Constructor
      sha384: Sha384Constructor
      sha512: Sha512Constructor
      utils: Utils
   }

   export interface Utils
   {
      toArray(msg: any, enc: 'hex'): Array<number>

      toHex(msg: any): string
   }

   export interface RipemdSet
   {
      ripemd160: Ripemd160Constructor
   }

   export interface ShaSet
   {
      sha1: Sha1Constructor
      sha224: Sha224Constructor
      sha256: Sha256Constructor
      sha384: Sha384Constructor
      sha512: Sha512Constructor
   }

   export interface HmacConstructor {(hash: BlockHash<any>, key: any, enc?: 'hex'): Hmac}

   export interface Ripemd160Constructor {(): Ripemd160}

   export interface Sha1Constructor {(): Sha1;}

   export interface Sha224Constructor {(): Sha224;}

   export interface Sha256Constructor {(): Sha256;}

   export interface Sha384Constructor {(): Sha384;}

   export interface Sha512Constructor {(): Sha512;}

   export interface Hmac extends MessageDigest<Hmac>
   {
      blockSize: 512
      outSize: 160
   }

   export interface Ripemd160 extends BlockHash<Ripemd160>, MessageDigest<Ripemd160>
   {
      blockSize: 512
      hmacStrength: 192
      outSize: 160
      padLength: 64
      endian: 'little'
   }

   export interface Sha1 extends BlockHash<Sha1>, MessageDigest<Sha1>
   {
      blockSize: 512
      hmacStrength: 80
      outSize: 160
      padLength: 64
      endian: 'big'
   }

   export interface Sha224 extends BlockHash<Sha224>, MessageDigest<Sha224>
   {
      blockSize: 512
      hmacStrength: 192
      outSize: 224
      padLength: 64
      endian: 'big'
   }

   export interface Sha256 extends BlockHash<Sha256>, MessageDigest<Sha256>
   {
      blockSize: 512
      hmacStrength: 192
      outSize: 256
      padLength: 64
      endian: 'big'
   }

   export interface Sha384 extends BlockHash<Sha384>, MessageDigest<Sha384>
   {
      blockSize: 1024
      hmacStrength: 192
      outSize: 384
      padLength: 128
      endian: 'big'
   }

   export interface Sha512 extends BlockHash<Sha512>, MessageDigest<Sha512>
   {
      blockSize: 1024
      hmacStrength: 192
      outSize: 512
      padLength: 128
      endian: 'big'
   }

   export declare const hash: HashJS;
}

declare const hash: HashJS;

export = hash
export as namespace hash;


