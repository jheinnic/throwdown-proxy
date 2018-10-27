import {CanvasDimensions} from './canvas-dimensions.value';
import {TaskIdentity} from './task-identity.value';
import {ModelSeed} from './model-seed.value';
import {MessageType} from './message-type.enum';
import {CompletionSignal} from './completion-signal.interface';

export class InputTaskMessage
{
   public readonly messageType: MessageType.INPUT_TASK = MessageType.INPUT_TASK;

   constructor(
      public readonly taskIdentity: TaskIdentity,
      // public readonly imageDimensions: CanvasDimensions,
      public readonly modelSeed: ModelSeed,
      public readonly relativeOutputPath: string,
      public readonly completeSignal: CompletionSignal<void>
   ) { }
}
