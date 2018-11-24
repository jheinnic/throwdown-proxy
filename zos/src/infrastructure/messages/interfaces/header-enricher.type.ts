import {MessageHeaders} from './message-headers.interface';

export type HeaderEnricher<I extends MessageHeaders, O extends MessageHeaders, M extends any = any> =
   (input: M, headers: I) => O;