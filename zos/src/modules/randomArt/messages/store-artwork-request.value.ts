import { Chan } from 'medium';
import { Canvas } from 'canvas';

import { MessageType } from './message-type.enum';
import { ArtworkStoredReply } from './artwork-stored-reply.value';
import { Path } from '../../../infrastructure/validation';

export class StoreArtworkRequest
{
   public readonly messageType: MessageType.STORE_ARTWORK_REQUEST = MessageType.STORE_ARTWORK_REQUEST;

   constructor(
      public readonly canvas: Canvas,
      public readonly completeSignal: Chan<ArtworkStoredReply, any>,
      public readonly storageLocation: Path = "/" as Path
   ) {
      // TODO Move init inside body and apply validation decorators.
   }
}

export interface IStoreArtworkRequest extends StoreArtworkRequest {

}
