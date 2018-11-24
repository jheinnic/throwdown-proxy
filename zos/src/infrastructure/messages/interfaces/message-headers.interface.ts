import {Merge} from 'simplytyped';
import {MessageHeadersMixin} from './message-headers-mixin.type';

export interface MessageHeaders
{
   with<T extends MessageHeaders>(overrides: Partial<T>, mixin: MessageHeadersMixin<T>): Merge<this, T>

   init(): MessageHeaders;
}
