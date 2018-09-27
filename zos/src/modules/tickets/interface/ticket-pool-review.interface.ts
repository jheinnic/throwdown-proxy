export interface ITicketPoolReview
{
   submitRender(buffer: Buffer, index: number): void;

   approveRender(index: number): void;

   rejectRender(index: number): void;
}