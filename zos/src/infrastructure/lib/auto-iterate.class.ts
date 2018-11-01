import {CO_TYPES, IConcurrentWorkFactory, asGenerator, SinkLike} from '@jchptf/coroutines';
import {DI_COMMON_TAGS} from '@jchptf/di-app-registry';

import {LIB_DI_TYPES} from './di/types';
import {SchedulerAction, SchedulerLike, Subscription, SubscriptionLike} from 'rxjs';
import {inject, tagged} from 'inversify';
import {IAutoIterate} from './interfaces';
import Queue from 'co-priority-queue';
import {co, WrappableCoRoutineGenerator} from 'co';

export class AutoIterate implements IAutoIterate {
   constructor(
      @inject(LIB_DI_TYPES.RxjsScheduler)
      @tagged(DI_COMMON_TAGS.VariantFor, LIB_DI_TYPES.AutoIterate)
      private readonly scheduler: SchedulerLike,
      @inject(CO_TYPES.ConcurrentWorkFactory)
      private readonly workFactory: IConcurrentWorkFactory) { }

   public run<T>(source: Iterable<T>, sink: SinkLike<T>, delay: number = 0): SubscriptionLike
   {
      const sourceIter: Iterator<T> = source[Symbol.iterator]();
      const sinkGenerator: (arg: T) => IterableIterator<any> = asGenerator(sink);

      return this.scheduler.schedule<Iterator<T>>(
         function (this: SchedulerAction<Iterator<T>>, state?: Iterator<T>): void {
            const iterResult = state!.next();
            if (! iterResult.done) {
               const sinkIter = sinkGenerator(iterResult.value);
               sinkIter.next();
               sinkIter.next();
               this.schedule(state, delay);
            }
         }, delay, sourceIter
      )
   }

   public cycle<T>(source: Iterable<T>, sink: SinkLike<T>, delay: number = 0): SubscriptionLike
   {
      const sourceIter: Iterator<T> = source[Symbol.iterator]();
      const sinkGenerator: (arg: T) => IterableIterator<any> = asGenerator(sink);

      return this.scheduler.schedule<Iterator<T>>(
         function (this: SchedulerAction<Iterator<T>>, state?: Iterator<T>): void {
            const iterResult = state!.next();
            if (! iterResult.done) {
               const sinkIter = sinkGenerator(iterResult.value);
               sinkIter.next();
               sinkIter.next();
               this.schedule(state, delay);
            } else {
               this.schedule(source[Symbol.iterator](), delay)
            }
         }, delay, sourceIter
      )
   }

   private static readonly CLOSED: symbol = Symbol.for('closed');

   public unwind<T>(master: Queue<Iterable<T>>, sink: SinkLike<T>, delay: number = 0): SubscriptionLike
   {
      const sources: Queue<Iterator<T>> =
         this.workFactory.createPriorityQueue<Iterator<T>>();

      var closed: boolean = false;

      co(function * () {
         while (! closed) {
            const nextIterable: Iterable<T> = yield master.next();
            sources.push(nextIterable[Symbol.iterator](), 5);
         }
         console.log('Closed!!');
      });

      const masterIter: (sources: Queue<Iterator<T>>) => Promise<T> = co.wrap(
         function * (sources: Queue<Iterator<T>>) {
            let nextIterator: Iterator<T>;
            let nextIterResult: IteratorResult<T>;

            do {
               nextIterator = yield sources.next();
               nextIterResult = nextIterator.next();
            } while (nextIterResult.done && (! closed));

            if (! closed) {
               sources.push(nextIterator, 0);
            }

            if ((!! nextIterResult) && (! nextIterResult.done)) {
               return nextIterResult.value;
            }

            return AutoIterate.CLOSED;
         });

      const sinkGenerator: (arg: T) => IterableIterator<any> = asGenerator(sink);

      const retVal: Subscription = this.scheduler.schedule<Queue<Iterator<T>>>(
         function (this: SchedulerAction<Queue<Iterator<T>>>, state?: Queue<Iterator<T>>): void {
            masterIter(state!).then(
               (value: T|symbol) => {
                  if (value !== AutoIterate.CLOSED) {
                     const sinkIter = sinkGenerator(value as T);
                     sinkIter.next();
                     sinkIter.next();
                     this.schedule(state, delay);
                  }
               }
            ).catch(
               (err: any) => {
                  console.error(err);
               }
            );
         }, delay, sources
      );

      retVal.add((): void => {
         closed = true;
      });

      return retVal;
   }

   public service<I, O>(source: Chan.Chan<I>, operation: WrappableCoRoutineGenerator<O, [I]>, sink: Chan.Chan<O>,
      concurrency: number = 1): void
   {
      const wrapFn = co.wrap<typeof operation, O, [I]>(operation);
      for( let ii = 0; ii < concurrency; ii++ ) {
         co( function*() {
            while (true) {
               const input = yield source;
               console.log(operation.name, '::' + ii + '::input::', input);
               const output: O = yield wrapFn(input);
               console.log(operation.name, '::' + ii + '::output::', output);
               yield sink(output as O);
            }
         });
      }
   }

   public serviceMany<I, O>(source: Chan.Chan<I>, operation: WrappableCoRoutineGenerator<O[], [I]>, sink: Chan.Chan<O>,
      concurrency: number = 1): void
   {
      const wrapFn = co.wrap<typeof operation, O[], [I]>(operation);
      for( let ii = 0; ii < concurrency; ii++ ) {
         co( function*() {
            while (true) {
               const input = yield source;
               console.log(operation.name, '::' + ii + '::input::', input);
               const output: O[] = yield wrapFn(input);
               let jj: number = 0;
               for (let outputVal of output) {
                  console.log(operation.name, '::' + ii + '::output #' + (jj++) + '::', outputVal);
                  yield sink(outputVal);
               }
            }
         })
      }
   }
}