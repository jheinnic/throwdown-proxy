import { UUID } from '../../../../infrastructure/validation';

export interface StorageSecret {
   readonly uuid: UUID;
   readonly privateCredential: string;
   readonly paintEngineVersion: string;

}