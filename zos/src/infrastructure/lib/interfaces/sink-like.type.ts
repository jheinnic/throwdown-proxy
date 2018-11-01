import {Subject} from 'rxjs';
import Queue from 'co-priority-queue';
import {IDirector} from '@jchptf/api';

export type SinkLike<T> = Chan.Chan<T> | Subject<T> | Queue<T> | IDirector<T>

export function isChan<T>(sink: SinkLike<T>): sink is Chan.Chan<T> {
   return sink.hasOwnProperty('close');
}

export function isSubject<T>(sink: SinkLike<T>): sink is Subject<T> {
   return sink.hasOwnProperty('observers');
}

export function isQueue<T>(sink: SinkLike<T>): sink is Queue<T> {
   return sink.hasOwnProperty('fns');
}

export function isDirector<T>(sink: SinkLike<T>): sink is IDirector<T> {
   return !isChan(sink) && !isSubject(sink) && !isQueue(sink)
}

export function * callSink<T>(sink: SinkLike<T>, arg: T): IterableIterator<any> {
   if (isChan(sink)) {
      yield sink(arg);
   } else if(isQueue(sink)) {
      yield sink.push(arg, 0);
   } else if(isSubject(sink)) {
      yield;
      sink.next(arg);
   } else {
      yield;
      sink(arg);
   }
}

export function asGenerator<T>(sink: SinkLike<T>): (arg: T) => IterableIterator<any>
{
   let retVal: (arg: T) => IterableIterator<any>;

   if (isChan(sink)) {
      retVal = function* (arg: T) {
         yield sink(arg);
      };
   } else if (isQueue(sink)) {
      retVal = function* (arg: T) {
         yield sink.push(arg, 0);
      };
   } else if (isSubject(sink)) {
      retVal = function* (arg: T) {
         yield;
         sink.next(arg);
      }
   } else {
      retVal = function* (arg: T) {
         yield;
         sink(arg);
      }
   }

   return retVal;
}
