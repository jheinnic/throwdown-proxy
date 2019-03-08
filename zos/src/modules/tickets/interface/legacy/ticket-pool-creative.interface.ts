import {TicketSlotLocator} from '../locators';

export interface ITicketPoolCreative
{
   submitRender(buffer: Buffer, slot: TicketSlotLocator): void;

   withdrawRender(slot: TicketSlotLocator): void;
}