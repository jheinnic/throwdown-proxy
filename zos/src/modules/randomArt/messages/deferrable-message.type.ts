import {CanvasAvailableMessage} from './canvas-available-message.value';
import {InputTaskMessage} from './input-task-message.value';
import {MessageType} from './message-type.enum';

export type DeferrableMessage = CanvasAvailableMessage | InputTaskMessage;
export type DeferrableMessageType = MessageType.INPUT_TASK | MessageType.CANVAS_AVAILABLE;
