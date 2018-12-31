import {MessageType} from './message-type.enum';
import {ICanvasManager} from '../interface';

export class CanvasPaintedReply
{
   public readonly messageType: MessageType.CANVAS_PAINTED_REPLY = MessageType.CANVAS_PAINTED_REPLY;

   constructor(public readonly canvasManager: ICanvasManager) { }
}

