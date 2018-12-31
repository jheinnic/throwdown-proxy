export interface Codec<T> {
   decode(serialized: Buffer): T;

   encode(message: T): Buffer;
}