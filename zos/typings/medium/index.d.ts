declare module 'medium'
{
  import 'medium';

  export interface Chan<T = any> {}

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
  export function chan<T = any>(numOrBuffer?: ChanBufferLike, xducer?: (arg: T) => T): Chan<T>

  /** Puts a value onto a channel. Returned promise resolves to true if successful, or false if the channel is closed. */
  export function put<T = any>(ch: Chan, val: T): Promise<boolean>

  /** Takes a value from a channel. Returned Promise resolves to taken value or CLOSED constant if the channel is closed. */
  export function take<T = any>(ch: Chan<T>): Promise<T | CLOSED>;

  /** Immediately invokes (and returns) given async function. */
  export function go( func: (...args: any[]) => void): Promise<void>;

  /** Creates a promise that will resolve successfully after ms milliseconds. */
  export function sleep(ms: number): Promise<void>

  /** A constant, which all takes on a closed channel receive instead of a value.*/
  export type CLOSED = object;
  export const CLOSED: CLOSED;

  /**
   * Closes a channel. This causes:
   * -- all puts and pending puts to resolve to false
   * -- all takes and pending takes to resolve to the CLOSED constant
   */
  export function close<T = any>(ch: Chan<T>): void;

  /** Makes a new channel, same as the old channel.*/
  export function clone<T = any>(ch: Chan<T>): Chan<T>;

  export type Alt<T = any, P = T> = Chan<T> | Promise<T> | [Chan<T|P>, P];

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
  export function any<T1 = any, T2 = any, P1 = T1, P2 = T2>(port1: Alt<T1, P1>, port2: Alt<T2, P2>): Promise<[T1|T2, Chan<T1|T2|P1|P2>|Promise<T1|T2>]>;
  export function any<T1 = any, T2 = any, T3 = any, P1 = T1, P2 = T2, P3 = T3>(port1: Alt<T1, P1>, port2: Alt<T2, P2>, port3: Alt<T3, P3>): Promise<[T1|T2|T3, Chan<T1|T2|T3|P1|P2|P3>|Promise<T1|T2|T3>]>;
  export function any<T1 = any, T2 = any, T3 = any, T4 = any, P1 = T1, P2 = T2, P3 = T3, P4 = T4>(port1: Alt<T1, P1>, port2: Alt<T2, P2>, port3: Alt<T3, P3>, port4: Alt<T4, P4>): Promise<[T1|T2|T3|T4, Chan<T1|T2|T3|T4|P1|P2|P3|P4>|Promise<T1|T2|T3|T4>]>;
  export function any<T1 = any, T2 = any, T3 = any, T4 = any, T5 = any, P1 = T1, P2 = T2, P3 = T3, P4 = T4, P5 = T5>(port1: Alt<T1, P1>, port2: Alt<T2, P2>, port3: Alt<T3, P3>, port4: Alt<T4, P4>, ...ports: Alt<T5, P5>[]): Promise<[T1|T2|T3|T4|T5, Chan<T1|T2|T3|T4|T5|P1|P2|P3|P4|P5>|Promise<T1|T2|T3|T4|T5>]>;

  /**
   * I don't love while loops, so I use this instead.
   *
   * As a bonus, you can track state without mutations! Return a value other than false, and it will be available as the argument to your callback async function.
   * Pass in a seed value as the second argument to repeat.
   */
  export function repeat<T = any>(func: (val: T) => void, seed: T): void;
  export function repeat<T = any>(func: (val?: T) => void, seed?: T): void;

   /**
    * This is just like repeat above, except that before it repeats, it waits for a successful take on the given channel.
    * Then it passes this taken value in as the first argument, with any local state being passed as the second argument.
    *
    * See the ping/pong example above to see this in action.
    */
  export function repeatTake<T = any, S = any>(ch: Chan<T>, fn: (cVal: T, iVal: S) => void, seed: S): void;
  export function repeatTake<T = any, S = any>(ch: Chan<T>, fn: (cVal: T, iVal?: S) => void, seed?: S): void;

  /**
   * Creates a new channel that will receive all puts to the received channels.
   */
  export function merge<T1 = any, T2 = any>(ch1: Chan<T1>, ch2: Chan<T2>): Chan<T1|T2>;
  export function merge<T1 = any, T2 = any, T3 = any>(ch1: Chan<T1>, ch2: Chan<T2>, ch3: Chan<T3>): Chan<T1|T2|T3>;
  export function merge<T1 = any, T2 = any, T3 = any, T4 = any>(ch1: Chan<T1>, ch2: Chan<T2>, ch3: Chan<T3>, ch4: Chan<T4>): Chan<T1|T2|T3|T4>;
  export function merge<T1 = any, T2 = any, T3 = any, T4 = any, T5 = any>(ch1: Chan<T1>, ch2: Chan<T2>, ch3: Chan<T3>, ch4: Chan<T4>, ...chs: Chan<T5>[]): Chan<T1|T2|T3|T4|T5>;

}
