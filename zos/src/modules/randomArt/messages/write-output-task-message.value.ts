import {Canvas, MyCanvasRenderingContext2D} from 'canvas';
import {TaskIdentity, MessageType} from '.';
import {CompletionSignal} from './completion-signal.interface';

export class WriteOutputTaskMessage
{
   public readonly messageType: MessageType.WRITE_OUTPUT_TASK = MessageType.WRITE_OUTPUT_TASK;

   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly canvas: Canvas,
      public readonly context: MyCanvasRenderingContext2D,
      public readonly relativeOutputPath: string,
      public readonly completeSignal: CompletionSignal<void>
   ) { }
}
