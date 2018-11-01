import {TaskIdentity} from './task-identity.value';
import {ModelSeed} from './model-seed.value';
import {MessageType} from './message-type.enum';
import {CompletionSignal} from './completion-signal.interface';
import {Path} from '../../../infrastructure/validation';

export class AssignCanvasRequest
{
   public readonly messageType: MessageType.ASSIGN_CANVAS_REQUEST = MessageType.ASSIGN_CANVAS_REQUEST;

   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly modelSeed: ModelSeed,
      public readonly relativeOutputPath: Path,
      public readonly completeSignal: CompletionSignal<void>
   ) { }
}
