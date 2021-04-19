import {KeyPairLocator, TicketSlotLocator} from '../locators';
import {PrivateKeyContent, PublicKeyContent} from '../../values';
import {UUID} from '../../../../infrastructure/validation';

export interface IKeyPairStagingAccess {
   readPublicKeyFile(locator: KeyPairLocator): Promise<PublicKeyContent>

   readPrivateKeyFile(locator: KeyPairLocator): Promise<PrivateKeyContent>

   writePublicKeyFile(locator: KeyPairLocator, content: PublicKeyContent): Promise<void>

   writePrivateKeyFile(locator: KeyPairLocator, content: PrivateKeyContent): Promise<void>

   findAllKeyPairs(leftToRight?: boolean): IterableIterator<KeyPairLocator>;

   findAllKeyPairsBySlot(slotLocator: TicketSlotLocator, leftToRight?: boolean): IterableIterator<KeyPairLocator>;

   getKeyPairLocator(slotLocator: TicketSlotLocator, version: UUID): KeyPairLocator
}