import {MessageHeaders} from './message-headers.interface';

export type MessageHandler<I extends any, O extends any, H extends MessageHeaders = MessageHeaders> =
   (input: I, headers: H) => O;