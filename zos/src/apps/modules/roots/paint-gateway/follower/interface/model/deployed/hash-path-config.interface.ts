export interface IHashPathConfig {
   readonly dirNameEncoding: 'base64' | 'hex';
   readonly fileNameEncoding: 'ascii' | 'latin1' | 'base64' | 'utf8' | 'hex';
   readonly fileNameSeparator: string;
   readonly prefixFirst: boolean;
   readonly hashAlgorithm: 'md5' | 'sha256' | 'ripemd160' | 'sha1' | 'whirlpool';
   readonly bitsPerTier: number[];
}