import {StatusCode} from './status-code.enum';

export class ReplyMessage<T extends any> {
   constructor(
      public readonly statusCode: StatusCode,
      public readonly error?: string,
      public readonly payload?: T
   ) { }
}