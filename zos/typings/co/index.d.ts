declare module 'co'
{
   import 'co';

   type CoWrap<F extends ((...args: any[]) => IterableIterator<any>), T> =
      ((...args: any[]) => IterableIterator<any>) extends ((...args: infer P) => IterableIterator<any>)
         ? (coroutine: ((...args: P) => IterableIterator<any>)) => ((...args: P) => Promise<T>)
         : never;

   interface CoFunc<T> {
      (coroutine: () => IterableIterator<any>): Promise<T>

      wrap: CoWrap<(...args: any[]) => IterableIterator<any>, T>
   }

   const co: CoFunc<any>
}