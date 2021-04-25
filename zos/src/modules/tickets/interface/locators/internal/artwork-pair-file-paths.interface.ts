import {TicketArtworkLocator} from '../ticket-artwork-locator.interface';

export interface ArtworkPairFilePaths
{
   readonly type: 'artwork-pair-files';
   readonly artworkLocator: TicketArtworkLocator;
   readonly fullImagePath: string;
   readonly thumbImagePath: string;
}