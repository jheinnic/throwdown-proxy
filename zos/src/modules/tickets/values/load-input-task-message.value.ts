import {KeyPairLocator} from '../interface/locators';
import {CompletionSignal} from '../../randomArt/messages';
import {Path, UUID} from '../../../infrastructure/validation';
import {RenderStyleName} from '../interface/policies';

export class LoadInputTaskMessage
{
   // public readonly messageType: MessageType.INPUT_TASK = MessageType.INPUT_TASK;

   constructor(
      public readonly publicKeyLocator: KeyPairLocator,
      public readonly renderPolicyName: RenderStyleName,
      public readonly configVersion: UUID,
      public readonly relativeOutputPath: Path,
      public readonly completeSignal: CompletionSignal<void>
   ) { }
}
