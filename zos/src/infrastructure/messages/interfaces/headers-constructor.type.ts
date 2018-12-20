import {isConstructor, MessageHeaders} from './message-headers.interface';

export type HeadersConstructor<T extends MessageHeaders> = {
   new(base?: ThisType<T>, overrides?: Partial<T>): T

   [isConstructor]: true;
}