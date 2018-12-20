import {correlated, CorrelationHeaders, correlationId} from './values/correlation-headers.interface';
import {
   callResponse, CallResponseHeaders, errorOn, replyOn
} from './values/call-response-headers.interface';
import {UUID} from '../validation';
import {chan} from 'medium';
import {MessageHeaders} from './interfaces';
import {BasicHeaders} from './values/basic-headers.value';

export const Foo = correlated<Object>(BasicHeaders); // as HeadersConstructor<Object>);

export let h1 = new BasicHeaders();

console.log(h1);

export let h2 = h1.with({
   [correlationId]: 'five' as UUID
   // [getDefaultFor]: <P extends keyof CorrelationHeaders>(prop: P): CorrelationHeaders[P]|undefined => {
   //    if (prop === correlationId) {
   //       return 'five' as UUID;
   //    }
   //    return undefined;
   // }
}, correlated);

console.log(h2[correlationId]);
console.log(h2);

export const FooBar = callResponse<string, number, CorrelationHeaders>(Foo);

export let cr = chan<string, boolean>();
export let ce = chan<number, boolean>();
export let h3: MessageHeaders<CorrelationHeaders & CallResponseHeaders<string, number>> =
   new FooBar();
export let h4 = new FooBar({
   [replyOn]: cr,
   [errorOn]: ce
});
export let h5 = new FooBar();

// console.log(h2[replyOn]);
console.log(h3[correlationId]);
console.log(h3);
console.log(h4);
console.log(h5);
console.log(h3[correlationId]);
console.log(h4[correlationId]);
console.log(h5[correlationId]);

console.log(h3[errorOn] == ce);
console.log(h3[replyOn] == cr);
console.log(h4[errorOn] == ce);
console.log(h4[replyOn] == cr);
console.log(h4[errorOn] == h3[errorOn]);
console.log(h4[replyOn] == h5[replyOn]);

export let arg1: CorrelationHeaders;
arg1 = h2;
arg1 = h3;

export let arg2: CallResponseHeaders;
arg2 = h3;
arg2 = h4;
// arg2 = h2;
// arg2 = arg1;



