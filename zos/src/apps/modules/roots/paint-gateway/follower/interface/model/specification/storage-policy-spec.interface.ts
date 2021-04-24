import { SupportedStorageProvider } from './common/supported-storage-provider.enum';
import { UUID } from '../../../../../../../infrastructure/validation';

export interface StoragePolicyDefinition {
   readonly uuid: UUID;
   readonly displayName: string;
   readonly connectUrl: string;
   readonly publicCredential: string;
   // readonly privateCredential: string;
   readonly serviceProvider: SupportedStorageProvider;
   readonly fileNameEncoding: 'ascii' | 'base64' | 'hex' | 'utf8';
   readonly fileNameSeparator: '_' | '-' | ':';
   readonly prefixFirst: boolean;
   readonly bitsPerTier: number[];
   readonly pathToRoot: string;
}