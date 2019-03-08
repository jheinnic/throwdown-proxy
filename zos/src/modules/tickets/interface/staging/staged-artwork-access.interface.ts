import {TicketArtworkLocator, KeyPairLocator, TicketSlotLocator} from '../locators/index';
import {FullArtworkContent, ThumbArtworkContent} from '../../values/index';
import {Name} from '../../../../infrastructure/validation/index';

export interface IStagedArtworkAccess {
   readFullArtworkFile(locator: TicketArtworkLocator): FullArtworkContent

   readThumbArtworkFile(locator: TicketArtworkLocator): ThumbArtworkContent

   writeFullArtworkFile(locator: TicketArtworkLocator, content: FullArtworkContent): void

   writeThumbArtworkFile(locator: TicketArtworkLocator, content: ThumbArtworkContent): void

   findAllArtwork(leftToRight?: boolean): IterableIterator<TicketArtworkLocator>;

   findAllArtworkByRender(renderStyle: Name, leftToRight?: boolean): IterableIterator<TicketArtworkLocator>;

   findAllArtworkBySlot(slotLocator: TicketSlotLocator, leftToRight?: boolean): IterableIterator<TicketArtworkLocator>;

   findAllArtworkBySlotAndRender(slotLocator: TicketSlotLocator, renderStyle: Name, leftToRight?: boolean): IterableIterator<TicketArtworkLocator>;

   findAllArtworkByKeyPair(keyPairLocator: KeyPairLocator, leftToRight?: boolean): IterableIterator<TicketArtworkLocator>;

   getArtworkLocator(keyPairLocator: KeyPairLocator, renderStyle: Name): TicketArtworkLocator
}