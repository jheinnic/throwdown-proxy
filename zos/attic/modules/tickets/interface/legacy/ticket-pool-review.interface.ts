import {TicketSlotLocator} from '../locators';

export interface ITicketPoolReview
{
   submitRender(buffer: Buffer, slot: TicketSlotLocator): void;

   approveRender(slot: TicketSlotLocator): void;

   rejectRender(slot: TicketSlotLocator): void;
}