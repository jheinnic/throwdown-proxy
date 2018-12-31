import {map, Transducer} from 'transducers-js';
import {Merge} from 'simplytyped';

import {MessageHeaders, WithHeadersType} from '../interfaces';
import {MessageHandler} from '../interfaces';
import {HeaderEnricher} from '../interfaces';
import {MessageHeadersMixin} from '../interfaces';
import {Message} from '../values/message.value';

export function handleMessage<I, O, H = void>
(handler: MessageHandler<I, O, H>): Transducer<Message<I, H>, Message<O, H>>
{
   return map((msg: Message<I, H>) => {
      const headers = msg.headers;
      const payloadOut = handler(msg.payload, headers);
      return new Message<O, H>(headers, payloadOut);
   });
}

export function augmentHeaders<I extends Readonly<any>, O extends Readonly<any>, M extends Readonly<any> = Readonly<Object>>(
   enricher: HeaderEnricher<I, O, M>,
   outputMixin: WithHeadersType<I, O>): Transducer<Message<M, I>, Message<M, I & O>>
{
   return map((msg: Message<M, I>): Message<M, I & O> => {
      const headersOut: O = enricher(msg.payload, msg.headers);
      const mergedOutput: MessageHeaders<I & O> = msg.headers.with(headersOut, outputMixin);
      return new Message<M, I & O>(mergedOutput, msg.payload);
   });
}
