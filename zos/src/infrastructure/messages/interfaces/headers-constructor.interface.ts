import {MessageHeaders} from './message-headers.interface';

export type HeadersConstructor<T extends MessageHeaders> = {
   new( ): T
}