import {MessageHeaders} from '../interfaces/message-headers.interface';
import {SimpleHeaders} from './simple-headers.value';

export class Message<P extends Readonly<any>, H extends MessageHeaders = SimpleHeaders>
{
   constructor(
      public readonly headers: H,
      public readonly payload: P)
   { }
}
