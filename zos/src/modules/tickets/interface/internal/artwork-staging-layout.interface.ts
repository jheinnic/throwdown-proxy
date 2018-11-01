import {DirectoryPath, FullArtworkFilePath, ThumbArtworkFilePath} from '../locators/internal';
import {ArtworkLocator} from '../locators';

export interface IArtworkStagingLayout {
   locateFullArtworkFile(locator: ArtworkLocator): FullArtworkFilePath

   locateThumbArtworkFile(locator: ArtworkLocator): ThumbArtworkFilePath

   findDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<DirectoryPath>;

   findLeafDirectories(leftToRight?: boolean): IterableIterator<DirectoryPath>;
}