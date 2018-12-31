import {FullArtworkFilePath} from './full-artwork-file-path.interface';
import {ThumbArtworkFilePath} from './thumb-artwork-file-path.interface';

export type ArtworkFilePath = FullArtworkFilePath | ThumbArtworkFilePath;

export function isFullArt(filePath: ArtworkFilePath): filePath is FullArtworkFilePath {
   return filePath.type === 'full-artwork-file';
}

export function isThumbArt(filePath: ArtworkFilePath): filePath is ThumbArtworkFilePath {
   return filePath.type === 'thumb-artwork-file';
}
