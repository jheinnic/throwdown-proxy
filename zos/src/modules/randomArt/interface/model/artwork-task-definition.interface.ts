import {UUID} from '../../../../infrastructure/validation';
import {IModelSeed} from './model-seed.interface';

export interface ArtworkTaskDefinition
{
   readonly modelSeed: IModelSeed;
   readonly renderPolicy: UUID;
   readonly storagePolicy: UUID;
}


