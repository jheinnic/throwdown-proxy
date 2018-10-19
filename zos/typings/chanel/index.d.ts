// declare namespace CanvasNames
declare module 'chanel'
{
   import 'chanel';

   function chanel<T>(options: ChanelOptions): Chanel<T>;

   interface ChanelOptions {
      readonly concurrency: number; // Default Infinity
      readonly discard: boolean;    // Default false
      readonly open: boolean;       // Default false
      readonly closed: boolean;     // Default true
   }

   interface Callback<V = any> {
      (err: any, value: V): void;
   }

   interface Thunk<V = any> {
      (cb: Callback<V>): void
   }

   interface Chanel<T> { // extends Thunk<T> {
      (cb: Callback<T>): void;
      (bool: true): Promise<void>;
      (cb: Callback<T> | true): void | Promise<void>;

      put(rcvr: Thunk<T>): void
      pushed(rcvr: Thunk<boolean>): void;

      readonly queue: number;
      readonly readable: boolean;
      readonly closed: boolean;
   }
}
