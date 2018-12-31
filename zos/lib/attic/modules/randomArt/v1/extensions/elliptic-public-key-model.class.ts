export class EllipticPublicKeyModel
{
   constructor(
      public readonly relativePath: string,
      public readonly nameExtension: string,
      public readonly prefixBits: Uint8Array,
      public readonly suffixBits: Uint8Array,
      public readonly novel: boolean)
   { }
}
