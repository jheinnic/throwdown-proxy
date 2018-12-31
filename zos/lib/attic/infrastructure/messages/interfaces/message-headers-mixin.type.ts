import {HeadersConstructor} from './headers-constructor.type';
import {isMixinDecorator} from './message-headers-helpers.interface';

export interface MessageHeadersMixin<O extends any> {
   <I extends any>(input: HeadersConstructor<I>): HeadersConstructor<O & I>,

   [isMixinDecorator]: true
}

