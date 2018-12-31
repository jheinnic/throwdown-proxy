import {IArtworkStagingLayout} from '../../modules/tickets/interface/internal';
import {
   DirectoryPath, FullArtworkFilePath, ThumbArtworkFilePath
} from '../../modules/tickets/interface/locators/internal';
import {TicketArtworkLocator} from '../../modules/tickets/interface/locators';
import {injectable} from 'inversify';

@injectable()
export class ArtworkLayoutFixture implements IArtworkStagingLayout
{
   public* findDirectoriesDepthFirst(_leftToRight?: boolean): IterableIterator<DirectoryPath>
   {
      return undefined;
   }

   public* findLeafDirectories(_leftToRight?: boolean): IterableIterator<DirectoryPath>
   {
      return undefined;
   }

   public locateFullArtworkFile(locator: TicketArtworkLocator): FullArtworkFilePath
   {
      return {
         type: 'full-artwork-file',
         locator,
         fullImagePath:
            `/Users/jheinnic/Documents/randomArt3/pkFixture/artwork_${locator.renderStyleName}/${locator.slotIndex.directoryIndex}-${locator.slotIndex.relativeAssetIndex}.png`
      };
   }

   public locateThumbArtworkFile(locator: TicketArtworkLocator): ThumbArtworkFilePath
   {
      return {
         type: 'thumb-artwork-file',
         locator,
         thumbImagePath:
            `/Users/jheinnic/Documents/randomArt3/pkFixture/artwork_${locator.renderStyleName}/thumb/${locator.slotIndex.directoryIndex}-${locator.slotIndex.relativeAssetIndex}.png`
      };
   }
}