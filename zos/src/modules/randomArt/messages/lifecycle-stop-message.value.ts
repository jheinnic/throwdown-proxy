import {MessageType} from './message-type.enum';

export class LifecycleStopMessage {
   public readonly messageType: MessageType.LIFECYCLE_STOP = MessageType.LIFECYCLE_STOP;
}