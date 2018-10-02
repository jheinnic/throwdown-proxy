import {Keys} from 'simplytyped';

export interface Director<B>
{
   (builder: B): void;
}

export type MapTo<S, T> = { // } N extends keyof S = keyof S> = {
   [K in keyof S]: (value: S[K]) => T
}

export type BagOf<T, S = any, N extends keyof any = keyof S> = {
   [K in N]: T
}

export type SymbolEnum<N extends keyof any = keyof any> = Record<N, symbol>;

export type MixableConstructor<T = object> = new (...args: any[]) => T;

export interface Wild {
   [x: string]: any
}

export type Mutable<T> = {
   -readonly [P in keyof T]: T[P];
}

export interface SelfCall<S extends SelfCall<S> = SelfCall<S>>
{
   [K: string]: (value: any) => S;
}

export interface PropertyBag
{
   [K: string]: Exclude<object, () => void>
}

export type IfExtends<T, B> = T extends B ? T : never;

export type MutablePartial<T> = { -readonly [P in keyof T]+?: T[P] };  // Remove readonly and add ?
export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };  // Remove readonly and ?
export type ReadonlyPartial<T> = { +readonly [P in keyof T]+?: T[P] };  // Add readonly and ?
export type ReadonlyRequired<T> = { +readonly [P in keyof T]-?: T[P] };  // Add readonly and remove ?

export type TypeName<T> =
   T extends string ? 'string' :
      T extends number ? 'number' :
         T extends boolean ? 'boolean' :
            T extends undefined ? 'undefined' :
               T extends Function ? 'function' : 'object';

export interface Getter<T = any> extends Function
{
   (): T
}

export type GetterReturnType<G extends Getter> = ReturnType<G>;

export interface Setter<P extends any[] = any[]> extends Function
{
   (...args: P): void
}

export type SetterParamTypes<S extends Setter> = S extends (...args: infer P) => void ? P : never;

export interface Operation<P extends any[] = any[], T extends any = any> extends Function
{
   (...args: P): Exclude<T, void>
}

export type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export type ValuePropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type ValueProperties<T> = Pick<T, ValuePropertyNames<T>>;

export type GetterPropertyNames<T> = {
   [K in FunctionPropertyNames<T>]: T[K] extends Getter ? K : never
}[FunctionPropertyNames<T>]
export type GetterProperties<T> = Pick<T, GetterPropertyNames<T>>

export type SetterPropertyNames<T> = {
   [K in FunctionPropertyNames<T>]: T[K] extends Setter ? K : never
}[FunctionPropertyNames<T>]
export type SetterProperties<T> = Pick<T, SetterPropertyNames<T>>

export type NoFunc<T> = TypeName<T> extends 'function' ? never : T;
export type OnlyNoFunc<T> = {
   [K in Keys<T>]: NoFunc<T[K]>
};
export type IsNoFunc<T> = T extends OnlyNoFunc<T> ? T : never;

export type Readable<T> = {
   [K in GetterPropertyNames<T> | ValuePropertyNames<T>]: T[K]
};
export type OnlyReadable<T> = {
   [K in keyof T]: T[K] extends Function ? (T[K] extends Getter ? T[K] : never) : T[K];
};
export type IfReadable<T> = IfExtends<T, OnlyReadable<T>>;

// export type OptionsBagInputPropertyNames<T> = ValuePropertyNames<T> | SetterPropertyNames<T>
// export type OptionsBagOutputPropertyNames<T> = ValuePropertyNames<T> | GetterPropertyNames<T>
export type OptionsBagPropertyNames<T> =
   ValuePropertyNames<T>
   | GetterPropertyNames<T>
   | SetterPropertyNames<T>;
export type OptionsBag<T> = Pick<T, OptionsBagPropertyNames<T>>
export type OnlyOptionsBag<T> = {
   [K in keyof T]: K extends OptionsBagPropertyNames<T> ? T[K] : never
}
export type IfOptionsBag<T> = IfExtends<T, OnlyOptionsBag<T>>;
