import {TicketArtworkLocator} from '../ticket-artwork-locator.interface';

export interface ThumbArtworkFilePath
{
   readonly type: 'thumb-artwork-file';
   readonly locator: TicketArtworkLocator;
   readonly thumbImagePath: string;
}