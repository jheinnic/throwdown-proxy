import {MerkleDigestLocator} from '@jchptf/merkle'

export interface TicketSlotLocator {
   readonly index: number;
   readonly digestLocator?: MerkleDigestLocator;
}