declare module 'co'
{
   import 'co';

   export interface CoRoutineGenerator<R extends any = any> {
      (): IterableIterator<R>
   }

   export interface WrappableCoRoutineGenerator<R extends any = any, P extends any[] = any[]> {
      (...args: P): IterableIterator<any>
   }

   export type WrappedCoRoutineGenerator<
      F extends WrappableCoRoutineGenerator<R, P>,
      R extends any = any,
      P extends any[] = any[]> = (...args: P) => Promise<R>;
   // F extends (...args: infer P) => IterableIterator<any>
   //    ? (...args: P) => Promise<R>
   //    : never
   // OverwriteReturn<F, Promise<R>>

   // Redundant
   // interface CoWrappingFunction<
   //    F extends WrappableCoRoutineGenerator<Promise<R>, P>,
   //    R extends any = any,
   //    P extends any[] = any[]>
   // {
   //    (coRoutine: F): WrappedCoRoutineGenerator<F, R, P>
   // }

   // type CoWrap<F extends ((...args: any[]) => IterableIterator<any>), T> =
   //    ((...args: any[]) => IterableIterator<any>) extends ((...args: infer P) => IterableIterator<any>)
   //       ? (coroutine: ((...args: P) => IterableIterator<any>)) => ((...args: P) => Promise<T>)
   //       : never;

   export interface Co {
      // (coroutine: () => IterableIterator<any>): Promise<T>
      <R extends any>(gen: CoRoutineGenerator<R>): Promise<R>

      // wrap: CoWrap<(...args: any[]) => IterableIterator<any>, T>
      wrap<
         F extends WrappableCoRoutineGenerator<R, P>,
         R extends any = any,
         P extends any[] = any[]>(gen: F): WrappedCoRoutineGenerator<F, R, P>
   }

   export const co: Co;
}