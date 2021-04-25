import {DirectoryPath, FullArtworkFilePath, ThumbArtworkFilePath} from '../locators/internal';
import {TicketArtworkLocator} from '../locators';

export interface IArtworkStagingLayout {
   locateFullArtworkFile(locator: TicketArtworkLocator): FullArtworkFilePath

   locateThumbArtworkFile(locator: TicketArtworkLocator): ThumbArtworkFilePath

   findDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<DirectoryPath>;

   findLeafDirectories(leftToRight?: boolean): IterableIterator<DirectoryPath>;
}