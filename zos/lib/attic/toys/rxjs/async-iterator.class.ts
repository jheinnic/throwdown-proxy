import {Observable, Subscription} from 'rxjs';

class DoneSentinel {
   private constructor() { }

   static INSTANCE: DoneSentinel = new DoneSentinel();
}

type Potential<T> = T | null | DoneSentinel;

interface PendingMessage<T>
{
   err: any;
   value: Potential<T>
}

export type PendingCallback<T> = (err: any, value: Potential<T>) => void;

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

   private * altIter(): Iterator<T>
   // private * iter (): IterableIterator<(cb: PendingCallback<T>) => void> {
   private * iter(): Iterator<T>
   {
      let isDone = false;

      let pendingCallback: PendingCallback<T> | null;
      let pendingValues: PendingMessage<T>[] = [];
      // TO DO: Look for a more efficient queue implementation.

      const callTheCallback = (callback: PendingCallback<T>, pendingValue: PendingMessage<T>) => {
         if (pendingValue.value === doneSentinel) {
            isDone = true;
         }
         callback(pendingValue.err, pendingValue.value);
      };

      const produce = (pendingValue: PendingMessage<T>) => {
         if (!!pendingCallback) {
            const cb = pendingCallback;
            pendingCallback = null;
            callTheCallback(cb, pendingValue);
         } else {
            pendingValues.push(pendingValue);
         }
      };

      const subscribeHandle = this._observable.subscribe(
         value => produce({
            err: null,
            value: value
         }),
         err => produce({
            err: err,
            value: null
         }),
         () => produce({
            err: null,
            value: doneSentinel
         }));

      // const consumeViaCallback =
         async function consumeViaCallback(cb: PendingCallback<T>) {
            let item = pendingValues.shift();
            if (item === undefined) {
               pendingCallback = cb;
            } else {
               return await callTheCallback(cb, item);
            }
         };

      while (!isDone) {
         let item = pendingValues.shift();
         console.log('Value requested');
         if (!!item && !!item.value) {
            if (item.value instanceof DoneSentinel) {
               isDone = true;
            } else {
               yield item.value;
               console.log('Yielded', item.value);
            }

            // callback(item.err, item.value);
            // isDone gets modified in callTheCallback, above.
            // new Promise<T>((resolve, reject) => {
            // consumeViaCallback(function(err, value) {
            //    if (!! err) {
            //       reject(err);
            //    } else {
            //       resolve(value);
            //    }
            // });
            // });
         }
      }
   }


   [Symbol.iterator]()
   {
      return this.iter();
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
