import {chan, Chan} from 'medium';
import {messageHeadersMixin} from './message-headers-mixin.function';
import {AbstractHeaders} from './abstract-headers.value';
import {Merge} from 'simplytyped';
import {MessageHeadersMixin} from '../interfaces/message-headers-mixin.type';
import {MessageHeaders} from '../interfaces/message-headers.interface';
import {HeadersConstructor} from '../interfaces/headers-constructor.interface';

export const replyOn = Symbol.for('ReplyOn');
export const errorOn = Symbol.for('ErrorOn');

export interface CallResponseHeaders extends AbstractHeaders
{
   readonly [errorOn]: Chan<any>;
   readonly [replyOn]: Chan<any>;
}

export const callResponse = messageHeadersMixin<CallResponseHeaders>({
   [errorOn]: chan(),
   [replyOn]: chan(),

   with<T extends MessageHeaders>(
      overrides: Partial<T>, mixin: MessageHeadersMixin<T>): Merge<CallResponseHeaders, T>
   {
      const ReturnType: HeadersConstructor<Merge<CallResponseHeaders, T>> =
         mixin<CallResponseHeaders>(this.constructor as HeadersConstructor<CallResponseHeaders>);
      const retVal = new ReturnType();

      return Object.assign(retVal, this, overrides);
   },

   init(): CallResponseHeaders {
      return {
         [errorOn]: chan(),
         [replyOn]: chan()
      } as CallResponseHeaders;
   }
});
