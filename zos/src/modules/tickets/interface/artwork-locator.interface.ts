import {TicketSlotLocator} from './ticket-slot-locator.interface';

export interface ArtworkLocator
{
   type: 'artwork'
   slotLocator: TicketSlotLocator;
   renderStyle: string;
   publicKeyPath: string;
   autoImageCheckPath: string;
   fullImagePath: string;
   thumbImagePath: string;
   // merkleBlock: MerkleDigestLocator;
}