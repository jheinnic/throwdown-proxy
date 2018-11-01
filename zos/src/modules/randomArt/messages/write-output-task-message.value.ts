import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {TaskIdentity, MessageType} from '.';
import {CompletionSignal} from './completion-signal.interface';
import {Path} from '../../../infrastructure/validation';

export class WriteOutputTaskMessage
{
   public readonly messageType: MessageType.SAVE_IMAGE_REQUEST = MessageType.SAVE_IMAGE_REQUEST;

   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly canvas: Canvas,
      public readonly context: MyCanvasRenderingContext2D,
      public readonly relativeOutputPath: Path,
      public readonly completeSignal: CompletionSignal<void>
   ) { }
}
