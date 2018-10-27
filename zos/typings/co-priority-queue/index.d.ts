declare module 'co-priority-queue' {
   import 'co-priority-queue';

   export default class Queue<T> {
      constructor();

      push(item: T, priority: number): void;

      next(): Promise<T>;
   }
}