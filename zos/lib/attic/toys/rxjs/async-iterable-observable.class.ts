import {Observable} from '../../node_modules/rxjs';
import {Operator} from '../../node_modules/rxjs/internal/Operator';
import {Junk} from './junk.class'

const origLift = Observable.prototype.lift;

Observable.prototype.lift = function lift<T, R>(operator: Operator<T, R>): Observable<R> {
   console.log('I see', operator);
   // return origLift.bind(this)(operator);
};

declare module './junk.class'
{
   interface Junk
   {
      makeBar(): string;
   }
}

Junk.prototype.makeBar = function () {
   return 'bar';
}
