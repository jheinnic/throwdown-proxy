import {makeReducingHandler, mixinPlus} from '@jchptf/api';
import {
   DefaultFieldValue, getDefaultFor, HeaderDefaults, HeadersConstructor, initHeaders, isConstructor,
   isMixinDecorator, MessageHeaders, MessageHeadersMixin
} from './interfaces';
import {Mutable} from '@jchptf/tupletypes';

export function messageHeadersMixin<O extends Object>(defaultHandler: HeaderDefaults<O>): MessageHeadersMixin<O>
{
   // The following cast relaxes the constraint on omitting "constructor" and "with", but it does
   // so after having enforced that constraint on user-provided input, so it is Ok to now treat these
   // properties as optionally omitted, since we will not add them incorrectly ourselves.
   // const behaveTwo: Partial<T> = behavior as unknown as Partial<T>;

   const behaviorHandler: DefaultFieldValue<O> =
      function <P extends keyof O>(this: Readonly<O>, key: P): O[P] {
         return defaultHandler[key](this);
      };

   return Object.assign(
      mixinPlus<MessageHeaders<O>, typeof getDefaultFor | typeof initHeaders, HeadersConstructor<O>>(
         {
            behavior: {
               [getDefaultFor]: behaviorHandler,
               [initHeaders]: function (this: Mutable<O>) {
                  let key;
                  for (key of Object.getOwnPropertySymbols(defaultHandler)) {
                     if (this[key as keyof O] === undefined) {
                        const value = defaultHandler[key as keyof O](this);
                        if (value !== undefined) {
                           this[key as keyof O] = value;
                        }
                     }
                  }
               }
            } as unknown as Partial<MessageHeaders<O>>,
            conflicts: {
               // Use any value from mixin as an optional override for value from base
               [getDefaultFor]: makeReducingHandler(
                  function(_base: any, _mixin: any): any {
                     return (_mixin === undefined) ? _base : _mixin
                  }
               ),
               [initHeaders]: makeReducingHandler(
                  function(_base: any, _mixin: any): any { })
            }
         },
         {
            behavior: {
               [isConstructor]: true
            },
            conflicts: {}
         }
      ),
      {[isMixinDecorator]: true} as { [isMixinDecorator]: true }
   );
}
