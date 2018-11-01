import {ArtworkLocator} from '../artwork-locator.interface';

export interface ArtworkPairFilePaths
{
   readonly type: 'artwork-pair-files';
   readonly artworkLocator: ArtworkLocator;
   readonly fullImagePath: string;
   readonly thumbImagePath: string;
}