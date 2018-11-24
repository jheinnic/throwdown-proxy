import {TicketArtworkLocator} from '../../tickets/interface/locators';
import {Path} from '../../../infrastructure/validation';

export interface ICanvasPathMapper {
   mapToPath(artwork: TicketArtworkLocator): Path;
}