import { SupportedStorageProvider } from '../common';
import { UUID } from '../../../../../../../../infrastructure/validation';

export interface StoragePolicySpec {
   readonly uuid: UUID;
   readonly displayName: string;
   readonly connectUrl: string;
   readonly publicCredential: string;
   // readonly privateCredential: string;
   readonly serviceProvider: SupportedStorageProvider;
   readonly hashAlgorithm: 'md5' | 'sha256' | 'ripemd160' | 'sha1' | 'whirlpool';
   readonly fileNameEncoding: 'ascii' | 'base64' | 'hex' | 'utf8';
   readonly fileNameSeparator: '_' | '-' | ':';
   readonly prefixFirst: boolean;
   readonly bitsPerTier: number[];
   readonly pathToRoot: string;
}