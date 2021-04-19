import {TicketSlotIndex} from './ticket-slot-index.interface';
import {TicketSlotPath} from './ticket-slot-path.type';

export type TicketSlotLocator = TicketSlotIndex | TicketSlotPath;

export function isSlotIndex(locator: TicketSlotLocator): locator is TicketSlotIndex {
   return (typeof locator === 'object');
}

export function isSlotPath(locator: TicketSlotLocator): locator is TicketSlotPath {
   return (typeof locator === 'string');
}
