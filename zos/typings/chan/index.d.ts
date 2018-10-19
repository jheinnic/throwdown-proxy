// declare namespace CanvasNames
declare module 'chan'
{
   import 'chan';

   function chan<T>(bufferSize?: number): Chan<T>;

   interface Callback<V = any> {
      (err: any, value: V): void;
   }

   interface Thunk<V = any> {
      (cb: Callback<V>): void
   }

   interface Chan<T> {
      (value: T): Thunk<T>;

      close(): void;

      select<T = any>(...args: Chan<T>[]): Thunk<Chan<T>>;
   }
}
