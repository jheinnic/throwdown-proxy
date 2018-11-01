import {SubscriptionLike} from 'rxjs';
import {SinkLike} from './sink-like.type';
import Queue from 'co-priority-queue';
import {WrappableCoRoutineGenerator} from "co";

export interface IAutoIterate {
   run<T>(source: Iterable<T>, sink: SinkLike<T>, delay?: number): SubscriptionLike;

   cycle<T>(source: Iterable<T>, sink: SinkLike<T>, delay?: number): SubscriptionLike;

   unwind<T>(master: Queue<Iterable<T>>, sink: SinkLike<T>, delay?: number): SubscriptionLike

   service<I, O>(source: Chan.Chan<I>, operation: WrappableCoRoutineGenerator<O, [I]>, sink: Chan.Chan<O>, concurrency?: number): void;

   serviceMany<I, O>(source: Chan.Chan<I>, operation: WrappableCoRoutineGenerator<O[], [I]>, sink: Chan.Chan<O>, concurrency?: number): void;
}