export interface ResourceAssociatedValue<R extends object, V> {
   readonly resource: R;
   readonly value: V;
}