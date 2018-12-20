import {MessageHeaders} from '../interfaces';

export class Message<P extends Readonly<any>, H extends Readonly<any> = Readonly<Object>>
{
   constructor(
      public readonly headers: MessageHeaders<H>,
      public readonly payload: P)
   { }
}
