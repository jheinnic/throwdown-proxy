import {correlated, CorrelationHeaders, correlationId} from './correlation-headers.interface';
import {callResponse, CallResponseHeaders} from './call-response-headers.interface';
import {SimpleHeaders} from './simple-headers.value';
import {Merge} from 'simplytyped';
import {UUID} from '../../validation';

export const Foo = correlated(SimpleHeaders);

export let h1 = new SimpleHeaders();

console.log(h1);

export let h2 = h1.with({
   [correlationId]: 'five' as UUID
}, correlated);

console.log(h2[correlationId]);
console.log(h2);

export const FooBar = callResponse(Foo);

export let h3: Merge<CorrelationHeaders, CallResponseHeaders> = new FooBar();
export let h4 = new FooBar();
export let h5 = new FooBar();

// console.log(h2[replyOn]);
console.log(h2[correlationId]);
console.log(h2);
console.log(h3);
console.log(h4);
console.log(h2[correlationId]);
console.log(h3[correlationId]);
console.log(h4[correlationId]);
