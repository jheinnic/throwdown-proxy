import {ResourceAssociatedValue} from './resource-associated-value.interface';
import {GroupedObservable} from 'rxjs';

export type ResourceGroupedObservable<T extends object, V> =
   GroupedObservable<T, ResourceAssociatedValue<T, V>>
