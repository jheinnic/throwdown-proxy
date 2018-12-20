import {WithHeadersType} from './with-headers-type.type';
import {MessageHeaders} from './message-headers.interface';

export const initHeaders = Symbol('initHeaders');
export const getDefaultFor = Symbol('getDefaultFor');
export const isConstructor = Symbol('isConstructor');
export const isMixinDecorator = Symbol('isMixinDecorator');

export interface MessageHeadersHelpers<H extends Object>
{
   with<T extends Object>(overrides: Partial<T>, withType: WithHeadersType<H, T>): MessageHeaders<H & T>

   // [getDefaultFor]<P extends keyof H>(key: P): H[P]|undefined;

   [initHeaders](): void;
}
