import {TicketSlotLocator} from './ticket-slot-locator.interface';

export interface KeyPairLocator
{
   type: 'key-pair'
   slotLocator: TicketSlotLocator;
   publicKeyPath: string;
   privateKeyPath: string;
   autoImageCheckPath: string;
   // merkleBlock: MerkleDigestLocator;
}