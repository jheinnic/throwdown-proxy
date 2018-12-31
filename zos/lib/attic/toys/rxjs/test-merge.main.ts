import {Observable, range} from "rxjs"
import "./async-iterable-observable.class";

const foo:Observable<number> = range(0, 10);
console.log('I have foo');
const bar = range(0, 10);
console.log('I have bar');

bar.subscribe(
   function(value) { console.log(value); }
);

foo.subscribe(
   function(value) { console.log(value); }
);
