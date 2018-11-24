declare namespace Chan {
   interface Callback<V = any> {
      (err: any, value: V): void;
   }

   interface Thunk<V = any> {
      (cb: Callback<V>): void
   }

   export interface Chan<V = any> extends Thunk<V> {
      (value: V): Thunk<void>;
      (cbOrValue: Callback<V>|V): void|Thunk<void>;

      close(): void;
   }

   interface ChanStatic {
      <T>(buffer?: number): Chan<T>;

      select<T = any>(...args: Chan<T>[]): Thunk<Chan<T>>;
   }
}

declare module 'chan'
{
   import 'chan';

   const chan: Chan.ChanStatic;

   export = chan;
}
