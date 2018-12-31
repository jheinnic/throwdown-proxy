
declare module 'medium'
{
  import 'medium';
  import {Transducer} from 'transducers-js';
  import {AnyFunc} from 'simplytyped';

  export interface Chan<S = any, T = S> extends Promise<T|object> {}

  export interface ChanBuffer {}

  export interface BufferFactories
  {
    unbuffered(): ChanBuffer;
    fixed(num: number): ChanBuffer;
    sliding(num: number): ChanBuffer;
    dropping(num: number): ChanBuffer;
  }

  export const buffers: BufferFactories;

  export type ChanBufferLike = number | ChanBuffer;
  /**
   * Creates a channel. All arguments are optional.
   *
   * numOfBuffer - Any number or buffer. A number is a shortcut for buffers.fixed(number).
   * xducer - a transducer to process/filter values with.
   */
  export function chan<S = any, T = S>(numOrBuffer?: ChanBufferLike, xducer?: Transducer<S, T>): Chan<T>

  /** Puts a value onto a channel. Returned promise resolves to true if successful, or false if the channel is closed. */
  export function put<S = any, T = S>(ch: Chan<S, T>, val: S): Promise<boolean>

  /** Takes a value from a channel. Returned Promise resolves to taken value or CLOSED constant if the channel is closed. */
  export function take<T = any>(ch: Chan<any, T>): Promise<T | typeof CLOSED>;

  /** Immediately invokes (and returns) given async function. */
  export function go<T>( func: AnyFunc<Promise<T>>): Promise<T>;

  /** Creates a promise that will resolve successfully after ms milliseconds. */
  export function sleep(ms: number): Promise<void>

  /** A constant, which all takes on a closed channel receive instead of a value.*/
  const CLOSED: symbol;
  export type CLOSED = typeof CLOSED;

  /**
   * Closes a channel. This causes:
   * -- all puts and pending puts to resolve to false
   * -- all takes and pending takes to resolve to the CLOSED constant
   */
  export function close(ch: Chan<any, any>): void;

  /** Makes a new channel, same as the old channel.*/
  export function clone<S = any, T = S>(ch: Chan<S, T>): Chan<S, T>;

  export type Alt<T = any> = Chan<any, T> | Promise<T> | [Chan<T, any>, T];

  export type AnyAlt<T = any> = Promise<[T, Chan<any, T> | Chan<T, any> | Promise<T>]>;
  /**
   * Like alts in Clojure's core-async.
   *
   * ports can be a channel to take from, a promise to resolve, or an array to put data onto a channel, like [ theChannel, valueToPut ].
   *
   * If none of them have a pending value, it will resolve with whichever channel receives a value next.
   *
   * If one of the channels has a pending value already, it will simply resolve to that.
   *
   * If more than one channel has a pending value, it selects one in a non-deterministic fashion.
   *
   * Always resolves with a double of [ theResolvedValue, theSourceChannel ].
   *
   * All non-winning actions will be canceled so that their data does not go missing.
  export function any(...ports) -> Promise -> [theResolvedValue, theSourceChannelOrPromise]
   */
  export function any<S1 = any>(...port: Alt<S1>[]): AnyAlt<S1>
  export function any<S1 = any, S2 = any>(port1: Alt<S1>, port2: Alt<S2>): AnyAlt<S1|S2>
  export function any<S1 = any, S2 = any, S3 = any>(port1: Alt<S1>, port2: Alt<S2>, port3: Alt<S3>): AnyAlt<S1|S2|S3>
  export function any<S1 = any, S2 = any, S3 = any, S4 = any>(port1: Alt<S1>, port2: Alt<S2>, port3: Alt<S3>, port4: Alt<S4>): AnyAlt<S1|S2|S3|S4>
  export function any<S1 = any, S2 = any, S3 = any, S4 = any, S5 = any>(port1: Alt<S1>, port2: Alt<S2>, port3: Alt<S3>, port4: Alt<S4>, ...ports: Alt<S5>[]): AnyAlt<S1|S2|S3|S4|S5>

  /**
   * I don't love while loops, so I use this instead.
   *
   * As a bonus, you can track state without mutations! Return a value other than false, and it will be available as the argument to your callback async function.
   * Pass in a seed value as the second argument to repeat.
   */
  export function repeat<T = any>(func: (val: T) => Promise<T|false>, seed: T): Promise<void>;
  export function repeat(func: () => Promise<void|false>): Promise<void>;

   /**
    * This is just like repeat above, except that before it repeats, it waits for a successful take on the given channel.
    * Then it passes this taken value in as the first argument, with any local state being passed as the second argument.
    *
    * See the ping/pong example above to see this in action.
    */
  export function repeatTake<T = any, S = any>(ch: Chan<any, T>, fn: (cVal: T, iVal: S) => Promise<S|false>, seed: S): Promise<void>;
  export function repeatTake<T = any>(ch: Chan<any, T>, fn: (cVal: T) => Promise<void|false>): Promise<void>;

  /**
   * Creates a new channel that will receive all puts to the received channels.
   */
  export function merge<T1 = any, T2 = T1>(ch1: Chan<any, T1>, ch2: Chan<any, T2>): Chan<any, T1|T2>;
  export function merge<T1 = any, T2 = T1, T3 = T2>(ch1: Chan<any, T1>, ch2: Chan<any, T2>, ch3: Chan<any, T3>): Chan<any, T1|T2|T3>;
  export function merge<T1 = any, T2 = T1, T3 = T2, T4 = T3>(ch1: Chan<any, T1>, ch2: Chan<any, T2>, ch3: Chan<any, T3>, ch4: Chan<any, T4>): Chan<any, T1|T2|T3|T4>;
  export function merge<T1 = any, T2 = T1, T3 = T2, T4 = T3, T5 = T4>(ch1: Chan<any, T1>, ch2: Chan<any, T2>, ch3: Chan<any, T3>, ch4: Chan<any, T4>, ...chs: Chan<any, T5>[]): Chan<any, T1|T2|T3|T4|T5>;
}
