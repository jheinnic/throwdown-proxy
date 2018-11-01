import {CanvasAvailableMessage} from './canvas-available-message.value';
import {AssignCanvasRequest} from './assign-canvas-request.value';
import {MessageType} from './message-type.enum';

export type DeferrableMessage = CanvasAvailableMessage | AssignCanvasRequest;
export type DeferrableMessageType = MessageType.ASSIGN_CANVAS_REQUEST | MessageType.RELEASE_CANVAS_REQUEST;
