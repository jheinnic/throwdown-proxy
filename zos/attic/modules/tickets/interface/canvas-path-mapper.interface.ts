import {TicketArtworkLocator} from './locators';
import {Path} from '../../../infrastructure/validation';

export interface ICanvasPathMapper {
   mapToPath(artwork: TicketArtworkLocator): Path;
}