import {Path} from '../../../infrastructure/validation';
import {MessageType} from './message-type.enum';

export class ArtworkStoredReply
{
   public readonly messageType: MessageType.ARTWORK_STORED_REPLY = MessageType.ARTWORK_STORED_REPLY;

   constructor(public readonly storageMappedPath: Path) { }
}

