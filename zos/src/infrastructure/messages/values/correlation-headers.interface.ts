import {UUID} from '../../validation';
import {messageHeadersMixin} from '../message-headers-mixin.function';
import uuid = require('uuid');
import {MessageHeadersMixin} from '../interfaces';

export const correlationId = Symbol.for('CorrelationId');

export interface CorrelationHeaders
{
   readonly [correlationId]: UUID;
}

export const correlated: MessageHeadersMixin<CorrelationHeaders> = messageHeadersMixin<CorrelationHeaders>(
   // with<T extends MessageHeaders>(
   //    overrides: Partial<T>, mixin: MessageHeadersMixin<T>): Merge<CorrelationHeaders, T>
   // {
   //    const ReturnType: HeadersConstructor<Merge<CorrelationHeaders, T>> =
   //       mixin<CorrelationHeaders>(this.constructor as HeadersConstructor<CorrelationHeaders>);
   //    const retVal = new ReturnType();
   //
   //    return Object.assign(retVal, this, overrides);
   // },
   // <P extends Keys<CorrelationHeaders>>(instance: CorrelationHeaders, key: P): undefined|CorrelationHeaders[P] => {
   //    switch(key) {
   //       case correlationId: {
   //          return uuid.v1() as UUID;
   //       }
   //       default: {
   //          return undefined;
   //       }
   //    }
   // }
   {
      [correlationId]: function (this: CorrelationHeaders): UUID { return uuid.v1() as UUID; }
   }
);
