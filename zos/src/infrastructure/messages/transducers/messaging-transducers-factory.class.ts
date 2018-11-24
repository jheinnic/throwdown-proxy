import {Message} from '../values/message.value';
import {MessageHeaders} from '../interfaces/message-headers.interface';
import {map, Transducer} from 'transducers-js';
import {MessageHandler} from '../interfaces/message-handler.type';
import {HeaderEnricher} from '../interfaces/header-enricher.type';
import {Merge} from 'simplytyped';
import {MessageHeadersMixin} from '../interfaces/message-headers-mixin.type';

export function handleMessage<I extends any, O extends any, H extends MessageHeaders = MessageHeaders>
(handler: MessageHandler<I, O, H>): Transducer<Message<I, H>, Message<O, H>>
{
   return map((msg: Message<I, H>) => {
      const headers = msg.headers;
      const payloadOut = handler(msg.payload, headers);
      return new Message<O, H>(headers, payloadOut);
   });
}

export function augmentHeaders<I extends MessageHeaders, O extends MessageHeaders, M extends any = any>(
   enricher: HeaderEnricher<I, O, M>,
   outputMixin: MessageHeadersMixin<O>): Transducer<Message<M, I>, Message<M, Merge<I, O>>>
{
   return map((msg: Message<M, I>): Message<M, Merge<I, O>> => {
      const headersOut: O = enricher(msg.payload, msg.headers);
      const mergedOutput: Merge<I, O> = msg.headers.with(headersOut, outputMixin);
      return new Message<M, Merge<I, O>>(mergedOutput, msg.payload);
   });
}
