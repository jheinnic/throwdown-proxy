import {Keys} from 'simplytyped';

export type DefaultFieldValue<T extends Object> =
   <P extends keyof T>(this: Readonly<T>, key: P) => T[P];

export type HeaderDefaults<T extends Object> = {
   [K in Keys<T>]: (instance: Readonly<T>) => T[K]
};
