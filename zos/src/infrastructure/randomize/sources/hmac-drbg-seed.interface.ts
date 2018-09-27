export interface HmacDrbgSeed {
   readonly entropyWord: Buffer;
   readonly nonceWord: Buffer;
   readonly additionalEntropy: ReadonlyArray<Buffer>
}