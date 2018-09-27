export interface ITicketPoolCreative
{
   submitRender(buffer: Buffer, index: number): void;

   withdrawRender(index: number): void;
}