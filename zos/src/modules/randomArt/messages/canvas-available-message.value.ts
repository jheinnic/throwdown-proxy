import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {MessageType} from './message-type.enum';

export class CanvasAvailableMessage
{
   public readonly messageType: MessageType.CANVAS_AVAILABLE = MessageType.CANVAS_AVAILABLE;
   
   constructor(
      readonly canvas: Canvas,
      readonly context: MyCanvasRenderingContext2D,
      readonly renders: ReadonlyArray<string>
   )
   { }
}
