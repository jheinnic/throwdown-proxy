import {ICanvasManager} from '../interface';
import {ArtworkLocator, ArtworkStoredReply, CompletionSignal, MessageType} from '.';
import {Chan, put, sleep} from 'medium';

export class StoreArtworkRequest
{
   public readonly messageType: MessageType.STORE_ARTWORK_REQUEST = MessageType.STORE_ARTWORK_REQUEST;

   constructor(
      public readonly artworkIdentity: ArtworkLocator,
      public readonly canvasLease: ICanvasManager,
      public readonly completeSignal: CompletionSignal<ArtworkStoredReply>
   ) { }
}


class CanvasStoreTask
{
   constructor(
      public readonly canvasId: CanvasId,
      public readonly sourceId: TaskDef,
      private readonly onReturn: Chan<number, any>
   )
   {
      console.log('Created storage task for ' + this.sourceId + ' on ' + this.canvasId);
   }

   async save(): Promise<void>
   {
      console.log('Saving...');
      await sleep(250);
      // console.log('Responding...');
      await put(this.onReturn, this.canvasId);
      console.log('Saved...')
   }
}