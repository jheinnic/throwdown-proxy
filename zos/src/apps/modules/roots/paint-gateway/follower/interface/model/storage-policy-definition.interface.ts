import { UUID } from '../../../../infrastructure/validation';
import { SupportedStorageProvider } from './supported-storage-provider.enum';

export interface StoragePolicyDefinition {
   readonly uuid: UUID;
   readonly displayName: string;
   readonly url: string;
   readonly publicCredential: string;
   // readonly privateCredential: string;
   readonly serviceProvider: SupportedStorageProvider;
   readonly paintEngineVersion: string;

}