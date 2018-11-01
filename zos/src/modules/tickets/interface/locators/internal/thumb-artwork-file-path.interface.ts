import {ArtworkLocator} from '../artwork-locator.interface';

export interface ThumbArtworkFilePath
{
   readonly type: 'thumb-artwork-file';
   readonly locator: ArtworkLocator;
   readonly thumbImagePath: string;
}