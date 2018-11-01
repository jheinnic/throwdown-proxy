import {PaintingArtifacts, TaskIdentity, MessageType} from '.';
import {CompletionSignal} from './completion-signal.interface';

export class PaintEngineTaskMessage
{
   public readonly messageType: MessageType.PAINT_CANVAS_REQUEST = MessageType.PAINT_CANVAS_REQUEST;

   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly paintingArtifacts: PaintingArtifacts,
      public readonly relativeOutputPath: string,
      public readonly completeSignal: CompletionSignal<void>
   ) { }

}
