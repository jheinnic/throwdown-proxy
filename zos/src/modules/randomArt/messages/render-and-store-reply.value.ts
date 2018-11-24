import {MessageType} from './message-type.enum';
import {Path} from '../../../infrastructure/validation';


export class RenderAndStoreReply
{
   public readonly messageType: MessageType.RENDER_AND_STORE_REPLY = MessageType.RENDER_AND_STORE_REPLY;
   
   constructor(
      public readonly storageMappedPath: Path,
      public readonly additionalInfo?: string) { }
}
