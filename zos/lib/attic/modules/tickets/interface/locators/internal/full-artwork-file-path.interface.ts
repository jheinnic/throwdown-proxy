import {TicketArtworkLocator} from '../ticket-artwork-locator.interface';
import {Path} from '../../../../../../../src/infrastructure/validation';

export interface FullArtworkFilePath
{
   readonly type: 'full-artwork-file';
   readonly locator: TicketArtworkLocator;
   readonly fullImagePath: Path;
}