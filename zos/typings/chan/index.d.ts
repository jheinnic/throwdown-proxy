declare namespace Chan {
   interface Callback<V = any> {
      (err: any, value: V): void;
   }

   interface Thunk<V = any> {
      (cb: Callback<V>): void
   }

   export interface Chan<V = any> {
      (cb: Callback<V>): void;
      (value: V): Thunk<V>;
      (cbOrValue: Callback<V>|V): void|Thunk<V>;

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
