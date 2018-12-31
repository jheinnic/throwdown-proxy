import {Name, UUID} from '../../../../infrastructure/validation';
import {TicketSlotIndex} from './ticket-slot-index.interface';

export interface TicketArtworkLocator
{
   readonly type: 'artwork'
   readonly slotIndex: TicketSlotIndex;
   readonly keyPairVersion: UUID;
   readonly assetPolicyVersion: UUID;
   readonly renderStyleName: Name;
   // publicKeyPath: string;
   // autoImageCheckPath: string;
   // fullImagePath: string;
   // thumbImagePath: string;
   // merkleBlock: MerkleDigestLocator;
}