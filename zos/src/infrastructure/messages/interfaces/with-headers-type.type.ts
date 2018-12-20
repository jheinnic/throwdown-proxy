import {HeadersConstructor} from './headers-constructor.type';
import {MessageHeadersMixin} from './message-headers-mixin.type';

export type WithHeadersType<Current extends any, Next extends any> =
   Current extends Next ? HeadersConstructor<Current & Next> : MessageHeadersMixin<Next>