import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {MessageType} from './message-type.enum';
import {ArtworkLocator} from '../interface/locators/artwork-locator.interface';
import {CompletionSignal} from './completion-signal.interface';
import {RenderAndStoreReply} from './render-and-store-reply.value';


export class RenderAndStoreRequest
{
   public readonly messageType: MessageType.RENDER_AND_STORE_REQUEST = MessageType.RENDER_AND_STORE_REQUEST;
   
   constructor(
      readonly artworkId: ArtworkLocator,
      readonly completionSignal: CompletionSignal<RenderAndStoreReply>
   ) { }
}
