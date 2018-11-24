import {MessageType} from './message-type.enum';
import {ICanvasManager} from '../interface';

export class CanvasAssignedReply
{
   public readonly messageType: MessageType.CANVAS_ASSIGNED_REPLY = MessageType.CANVAS_ASSIGNED_REPLY;

   constructor(public readonly canvasManager: ICanvasManager) { }
}
