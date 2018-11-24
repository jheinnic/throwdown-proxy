import {MessageHeaders} from '../interfaces/message-headers.interface';

export type MessageHeadersMixinDefaults<T extends MessageHeaders> =
   { init(): T } & T;
   // { init(): any } & Pick<T, Exclude<Keys<T>, 'with' | 'constructor'>>;
