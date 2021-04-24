export interface IHashPathConfig {
   readonly fileNameEncoding: 'ascii' | 'base64' | 'utf8' | 'hex';
   readonly prefixSuffixSeparator: string;
   readonly prefixBeforeSuffix: boolean;
   readonly hashAlgorithm: 'md5' | 'sha256' | 'ripemd160' | 'sha1' | 'whirlpool';
   readonly bitsPerTier: number[];
}