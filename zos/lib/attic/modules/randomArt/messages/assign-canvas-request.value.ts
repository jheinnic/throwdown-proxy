import {ArtworkLocator} from '../interface/locators/artwork-locator.interface';
import {ModelSeed} from '../interface/locators/model-seed.interface';
import {MessageType} from './message-type.enum';
import {CompletionSignal} from './completion-signal.interface';
import {Path} from '../../../infrastructure/validation';
import {CanvasAssignedReply} from './canvas-assigned-reply.value';

export class AssignCanvasRequest
{
   public readonly messageType: MessageType.ASSIGN_CANVAS_REQUEST = MessageType.ASSIGN_CANVAS_REQUEST;

   constructor(
      public readonly taskIdentity: ArtworkLocator,
      public readonly modelSeed: ModelSeed,
      public readonly relativeOutputPath: Path,
      public readonly completeSignal: CompletionSignal<CanvasAssignedReply>
   ) { }
}
