import {KeyPairLocator} from '../interface/locators';
import { Chan } from 'medium';
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
      public readonly completeSignal: Chan<void>
   ) { }
}
