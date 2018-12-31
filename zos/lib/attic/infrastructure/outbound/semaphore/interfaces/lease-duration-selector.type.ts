import {Observable} from 'rxjs';
import {ResourceGroupedObservable} from './resource-grouped-observable.interface';

export type LeaseDurationSelector<T extends object, V> =
   (grouped: ResourceGroupedObservable<T, V>) => Observable<any>;