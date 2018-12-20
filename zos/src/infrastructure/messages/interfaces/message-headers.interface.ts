import {MessageHeadersHelpers} from './message-headers-helpers.interface';

export type MessageHeaders<T extends any> = T & MessageHeadersHelpers<T>
