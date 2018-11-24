import {UUID} from '../../validation';
import {MessageHeaders} from '../interfaces/message-headers.interface';
import {messageHeadersMixin} from './message-headers-mixin.function';
import uuid = require('uuid');

export const correlationId = Symbol.for('CorrelationId');

export interface CorrelationHeaders extends MessageHeaders
{
   readonly [correlationId]: UUID;
}

export const correlated = messageHeadersMixin<CorrelationHeaders>({
   // [correlationId]: uuid.v1() as UUID,

   // with<T extends MessageHeaders>(
   //    overrides: Partial<T>, mixin: MessageHeadersMixin<T>): Merge<CorrelationHeaders, T>
   // {
   //    const ReturnType: HeadersConstructor<Merge<CorrelationHeaders, T>> =
   //       mixin<CorrelationHeaders>(this.constructor as HeadersConstructor<CorrelationHeaders>);
   //    const retVal = new ReturnType();
   //
   //    return Object.assign(retVal, this, overrides);
   // },

   init(): CorrelationHeaders {
      return {
         [correlationId]: uuid.v1() as UUID
      } as CorrelationHeaders;
   }
});
