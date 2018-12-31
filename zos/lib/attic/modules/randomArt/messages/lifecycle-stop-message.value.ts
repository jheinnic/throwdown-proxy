import {MessageType} from './message-type.enum';

export class LifecycleStopMessage {
   public readonly messageType: MessageType.SHUTDOWN_REQUEST = MessageType.SHUTDOWN_REQUEST;
}