import {TicketArtworkLocator} from '../../tickets/interface/locators';
import {Path} from '../../../../../src/infrastructure/validation';

export interface ICanvasPathMapper {
   mapToPath(artwork: TicketArtworkLocator): Path;
}