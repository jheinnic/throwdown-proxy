import {ArtworkLocator, KeyPairLocator, TicketSlotLocator} from '../locators/index';
import {FullArtworkContent, ThumbArtworkContent} from '../../values/index';
import {Name} from '../../../../infrastructure/validation/index';

export interface IStagedArtworkAccess {
   readFullArtworkFile(locator: ArtworkLocator): FullArtworkContent

   readThumbArtworkFile(locator: ArtworkLocator): ThumbArtworkContent

   writeFullArtworkFile(locator: ArtworkLocator, content: FullArtworkContent): void

   writeThumbArtworkFile(locator: ArtworkLocator, content: ThumbArtworkContent): void

   findAllArtwork(leftToRight?: boolean): IterableIterator<ArtworkLocator>;

   findAllArtworkByRender(renderStyle: Name, leftToRight?: boolean): IterableIterator<ArtworkLocator>;

   findAllArtworkBySlot(slotLocator: TicketSlotLocator, leftToRight?: boolean): IterableIterator<ArtworkLocator>;

   findAllArtworkBySlotAndRender(slotLocator: TicketSlotLocator, renderStyle: Name, leftToRight?: boolean): IterableIterator<ArtworkLocator>;

   findAllArtworkByKeyPair(keyPairLocator: KeyPairLocator, leftToRight?: boolean): IterableIterator<ArtworkLocator>;

   getArtworkLocator(keyPairLocator: KeyPairLocator, renderStyle: Name): ArtworkLocator
}