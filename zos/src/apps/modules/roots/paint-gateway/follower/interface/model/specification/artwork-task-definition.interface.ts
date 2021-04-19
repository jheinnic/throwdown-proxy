import { IArtworkSeed } from './artwork-seed.interface';
import { UUID } from '../../../../../../../../infrastructure/validation';

export interface ArtworkTaskDefinition
{
   readonly taskId: UUID;
   readonly renderPolicy: UUID;
   readonly storagePolicy: UUID;
   readonly artworkSeed: IArtworkSeed;
   readonly paintEngineVersion: string;
}
