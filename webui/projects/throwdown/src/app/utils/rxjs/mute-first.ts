import {combineLatest, Observable, SubscribableOrPromise} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

export function muteFirst<T>(
  fromRemote$: SubscribableOrPromise<T>,
  fromStore$: SubscribableOrPromise<T>
): Observable<T>
{
  return combineLatest(fromRemote$, fromStore$)
    .pipe(
      map((a: T, b: T): T => b),
      distinctUntilChanged()
    );
}
