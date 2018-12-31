import {MessageHeaders} from './message-headers.interface';
import {isConstructor} from './message-headers-helpers.interface';

export type HeadersConstructor<T extends any> = {
   new(base?: Partial<T>, overrides?: Partial<T>): MessageHeaders<T>,

   [isConstructor]: true
}