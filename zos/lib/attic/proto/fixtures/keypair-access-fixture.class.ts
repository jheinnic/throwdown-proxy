import {IKeyPairStagingAccess} from '../../modules/tickets/interface/staging';
import {KeyPairLocator, TicketSlotLocator} from '../../modules/tickets/interface/locators';
import {UUID} from '../../../../src/infrastructure/validation';
import {PrivateKeyContent, PublicKeyContent} from '../../modules/tickets/values';
import {injectable} from 'inversify';

@injectable()
export class KeyPairAccessFixture implements IKeyPairStagingAccess {
   public findAllKeyPairs(leftToRight?: boolean): IterableIterator<KeyPairLocator>
   {
      return undefined;
   }

   public findAllKeyPairsBySlot(
      slotLocator: TicketSlotLocator, leftToRight?: boolean): IterableIterator<KeyPairLocator>
   {
      return undefined;
   }

   public getKeyPairLocator(slotLocator: TicketSlotLocator, version: UUID): KeyPairLocator
   {
      return undefined;
   }

   public readPrivateKeyFile(locator: KeyPairLocator): Promise<PrivateKeyContent>
   {
      return undefined;
   }

   public readPublicKeyFile(locator: KeyPairLocator): Promise<PublicKeyContent>
   {
      return undefined;
   }

   public writePrivateKeyFile(locator: KeyPairLocator, content: PrivateKeyContent): Promise<void>
   {
      return undefined;
   }

   public writePublicKeyFile(locator: KeyPairLocator, content: PublicKeyContent): Promise<void>
   {
      return undefined;
   }

}