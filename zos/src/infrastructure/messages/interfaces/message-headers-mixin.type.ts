import {HeadersConstructor} from './headers-constructor.interface';
import {Merge} from 'simplytyped';
import {MessageHeaders} from './message-headers.interface';

export type MessageHeadersMixin<O extends MessageHeaders> =
   <I extends MessageHeaders>(input: HeadersConstructor<I>) => HeadersConstructor<Merge<I, O>>
