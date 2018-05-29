import {Observable, SubscribableOrPromise} from 'rxjs/observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';

export function muteFirst<T>(
  fromRemote$: SubscribableOrPromise<T>,
  fromStore$: SubscribableOrPromise<T>
): Observable<T> {
  return combineLatest(
    fromRemote$,
    fromStore$,
    (a, b) => b
  ).distinctUntilChanged();
}
