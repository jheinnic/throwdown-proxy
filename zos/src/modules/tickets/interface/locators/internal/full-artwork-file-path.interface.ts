import {ArtworkLocator} from '../artwork-locator.interface';
import {Path} from '../../../../../infrastructure/validation';

export interface FullArtworkFilePath
{
   readonly type: 'full-artwork-file';
   readonly locator: ArtworkLocator;
   readonly fullImagePath: Path;
}