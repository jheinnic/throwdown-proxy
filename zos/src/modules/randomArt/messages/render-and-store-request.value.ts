import { MessageType } from './message-type.enum';
import { CompletionSignal } from './completion-signal.type';
import { RenderAndStoreReply } from './render-and-store-reply.value';
import { IArtworkSeed } from '../../../apps/modules/roots/paint-gateway/follower/interface/model';
import { Path } from '../../../infrastructure/validation';


export class RenderAndStoreRequest
{
   public readonly messageType: MessageType.RENDER_AND_STORE_REQUEST = MessageType.RENDER_AND_STORE_REQUEST;
   
   constructor(
      readonly renderContent: IArtworkSeed,
      readonly storageLocation: Path,
      readonly completionSignal: CompletionSignal<RenderAndStoreReply>
   ) { }
}