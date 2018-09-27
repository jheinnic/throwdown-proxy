import EventEmitter = NodeJS.EventEmitter;
import {BagOf} from './utility';

export interface FSMOptions<S extends string, A extends string> {
   initialize(options: Pick<FSMOptions<S, A>, Exclude<keyof FSMOptions<S, A>, 'initialize'>>): void;
   namespace: string;
   initialState: keyof S;
   states: BagOf<IStateDef<S, A>, S>
}

export type FSMInstance<I, S extends string, A extends string> = FSMOptions<S, A> & I;

export declare class AbstractState<S extends string, A extends string> extends EventEmitter {
   deferUntilTransition(toState?: S): void;
   handle(action: A): void;
   transition(state: S): void;
}
export interface IAbstractState<S extends string, A extends string> extends AbstractState<S, A> {
   "*"?:() => void
   _onEnter?: () => void
   _onExit?: () => void
}

export type IStateDef<S extends string, A extends string> = {
   [K in A]: S | ((this: ThisType<IAbstractState<S, A>>) => void)
}


export interface BehavioralFSMOptions<O, S extends string, A extends string> {
   initialize(options: BehavioralFSMOptions<O, S, A>): void;
   namespace: string;
   initialState: keyof S;
   states: BagOf<Test<O, S, A>, S>
}

export type BehavioralFSMInstance<I, O, S extends string, A extends string> = BehavioralFSMOptions<O, S, A> & I;

export declare abstract class AbstractBehavioralState<O, S extends string, A extends string> extends EventEmitter {
   deferUntilTransition(client: O, toState?: S): void;

   handle(client: O, action: A): void;
   transition(client: O, state: S): void;
}

export interface IAbstractBehavioralState<O, S extends string, A extends string> {
   "*"?: (this: AbstractBehavioralState<O, S, A>, client: O) => void,
   _onEnter?: (this: AbstractBehavioralState<O, S, A>, client: O) => void,
   _onExit?: (this: AbstractBehavioralState<O, S, A>, client: O) => void,
   [K: string]: undefined | S | ((this: AbstractBehavioralState<O, S, A>, client: O) => void);
}

export type IBehavioralStateDef<O, S extends string, A extends string> = {
   [K in (A|"*"|"_onEnter"|"_onExit")]?: S | ((this: AbstractBehavioralState<O, S, A>, inst: O) => void)
}

export type Test<O, S extends string, A extends string> = Extract<IAbstractBehavioralState<O, S, A>, IBehavioralStateDef<O, S, A>>