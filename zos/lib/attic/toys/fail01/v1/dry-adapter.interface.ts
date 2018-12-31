export interface IDryAdapter<T> {
   getDryProxy(): T;

   revoke(): void;
}