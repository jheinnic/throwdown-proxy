import {chan, Chan} from 'medium';
import {messageHeadersMixin} from '../message-headers-mixin.function';
import {HeadersConstructor} from '../interfaces/headers-constructor.type';

export const replyOn = Symbol.for('ReplyOn');
export const errorOn = Symbol.for('ErrorOn');

export interface CallResponseHeaders<Reply = any, Error = any>
{
   readonly [errorOn]: Chan<Reply, any>,
   readonly [replyOn]: Chan<Error, any>
}

const callResponseFunc = messageHeadersMixin<CallResponseHeaders>({
   [errorOn]: function() { return chan(); },
   [replyOn]: function() { return chan(); }
   //
   // with<T extends MessageHeaders>(
   //    overrides: Partial<T>, mixin: MessageHeadersMixin<T>): Merge<CallResponseHeaders, T>
   // {
   //    const ReturnType: HeadersConstructor<Merge<CallResponseHeaders, T>> =
   //       mixin<CallResponseHeaders>(this.constructor as HeadersConstructor<CallResponseHeaders>);
   //    const retVal = new ReturnType();
   //
   //    return Object.assign(retVal, this, overrides);
   // },
   //
   // init(): CallResponseHeaders {
   //    return {
   //       [errorOn]: chan(),
   //       [replyOn]: chan()
   //    } as CallResponseHeaders;
   // }
});

export function callResponse<R, E, I = any>(
   input: HeadersConstructor<I>): HeadersConstructor<CallResponseHeaders<R, E> & I>
{
   return callResponseFunc(input);
}