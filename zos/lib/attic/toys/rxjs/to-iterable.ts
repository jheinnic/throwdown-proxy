import {asapScheduler, Observable, Subscription} from 'rxjs';

class DoneSentinel {
   private constructor() { }

   static INSTANCE: DoneSentinel = new DoneSentinel();
}

// type Potential<T> = T | null | DoneSentinel;

interface PendingMessage<T>
{
   err?: any;
   value?: T;
   done: boolean;
}

// export type PendingCallback<T> = (err: any, value: Potential<T>) => void;

const doneSentinel: DoneSentinel = DoneSentinel.INSTANCE;

/*
interface SubscribedIterableIterator<T> extends IterableIterator<T>
{
   nextValue(): IterableIterator<T>;

   shouldComplete(): void;

   shouldThrow(): void;

   unsubscribe(): void;
}
*/

/**
 * Returns a function that, when called,
 * returns a generator object that is immediately
 * ready for input via `next()`
 */
function coroutine(generatorFunction) {
   return function (...args) {
      const generatorObject = generatorFunction(...args);
      generatorObject.next();
      return generatorObject;
   };
}

/**
 * Accepts an RxJS Observable object and converts it to an ES6 generator
 * function yielding the same results.
 */
export class AsyncObservableIterator<T> implements Iterable<T>
{
   private _observable: Observable<T>;

   private _subscribeHandle?: Subscription | boolean;

   // private _iter?: IterableIterator<(cb: PendingCallback<T>) => void>;

   public constructor(observable: Observable<T>)
   {
      this._observable = observable;
      this._subscribeHandle = undefined;
      // this._iter = undefined;
   }

   private * altIter(): IterableIterator<T> {
      let value: PendingMessage<T> = {err: null, value: null};
      do {
         if ((value.value !== null) && (value.value !== doneSentinel)) {
            const msg = yield value.value as T;
         }
         value = { err: null, value: yield value.value; };
      } while ((! value.value) || (value.value === doneSentinel));
   }

   private * iter(): IterableIterator<T> {

   }

   private * workIter(toOutput: IterableIterator<PendingMessage<T>>): IterableIterator<PendingMessage<T>>
   {
      let subscribeHandle;
      // let isDone = false;
      // let isError = false;

      try {
         subscribeHandle = this._observable.subscribe(
            value => toOutput.next({
               err: null,
               value: value
            }),
            err => toOutput.next({
               err: err,
               value: null
            }),
            () => toOutput.next({
               err: null,
               value: doneSentinel
            }));
      } finally {
         if (!!subscribeHandle) {
            subscribeHandle.unsubscribe();
         }
      }
   }

   [Symbol.iterator]()
   {
      const fromObservable = this.iter();
      coroutine(this.workIter(fromObservable));

      return myIter;
   }


   /*
   * nextValue () {
      if (!this._iter) {
         throw new Error('Expected iterator to have already been set');
      }

      let item = yield this._iter.next();
      if (item.value === doneSentinel) {
         throw new Error('Expected next notification, got complete instead');
      }

      return item.value;
   }

   * shouldComplete() {
      if (!this._iter) {
         throw new Error('Expected iterator to have already been set');
      }

      let item = yield this._iter.next();
      if (item.value !== doneSentinel) {
         throw new Error('Expected complete notification, got next(' + item.value + ') instead');
      }
   }

   * shouldThrow() {
      if (!this._iter) {
         throw new Error('Expected iterator to have already been set');
      }

      let item;

      try {
         item = yield this._iter.next();
      } catch (err) {
         return err;
      }

      if (item.value === doneSentinel) {
         throw new Error('Expected error notification, got complete instead');
      } else {
         throw new Error('Expected error notification, got next(' + item.value + ') instead');
      }
   }
   */

   unsubscribe () {
      if (this._subscribeHandle === undefined) {
         throw new Error('toAsyncIterator: unsubscribing before first yield not allowed');
      }

      // Quietly ignore second unsubscribe attempt.
      if (this._subscribeHandle instanceof Subscription) {
         this._subscribeHandle.unsubscribe();
         this._subscribeHandle = false;
      }
   }

   /*
   public makeIter(): SubscribedIterableIterator<(cb: PendingCallback<T>) => void> {
      let result = this.iter() as SubscribedIterableIterator<(cb: PendingCallback<T>) => void>;

      result.nextValue = () => this.nextValue();
      // result.shouldComplete = () => this.shouldComplete();
      // result.shouldThrow = () => this.shouldThrow();
      // result.unsubscribe = () => this.unsubscribe();

      this._iter = result;
      return result;
   }
   */
}
