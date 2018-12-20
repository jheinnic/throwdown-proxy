import {Operator} from 'rxjs/src/internal/Operator';
import {ResourceGroupedObservable} from './resource-grouped-observable.interface';

export type BorrowResourceOperator<T extends object, V> =
   Operator<V, ResourceGroupedObservable<T, V>>