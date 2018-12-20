import {makeReducingHandler, mixinPlus} from '@jchptf/api';
import {
   getDefaultFor, isConstructor, isMixinDecorator, MessageHeaders
} from '../interfaces/message-headers.interface';
import {MessageHeadersMixin} from '../interfaces/message-headers-mixin.type';
import {HeadersConstructor} from '../interfaces/headers-constructor.interface';
import {DefaultFieldValue} from '../interfaces/default-field-value.type';

export function messageHeadersMixin<O extends MessageHeaders>(
   defaultHandler: DefaultFieldValue<O>): MessageHeadersMixin<O>
{
   // The following cast relaxes the constraint on omitting "constructor" and "with", but it does
   // so after having enforced that constraint on user-provided input, so it is Ok to now treat these
   // properties as optionally omitted, since we will not add them incorrectly ourselves.
   // const behaveTwo: Partial<T> = behavior as unknown as Partial<T>;
   return Object.assign(
      mixinPlus<O, typeof getDefaultFor, HeadersConstructor<O>>(
         {
            behavior: {
               [getDefaultFor]: defaultHandler
            } as Partial<O>,
            conflicts: {
               // Use any value from mixin as an optional override for value from base
               [getDefaultFor]: makeReducingHandler(
                  (_base: any, _mixin: any): any => ((_mixin === undefined) ? _base : _mixin)
               )
            }
         },
         {
            behavior: {
               [isConstructor]: true
            },
            conflicts: {}
         }
      ),
      { [isMixinDecorator]: true } as { [isMixinDecorator]: true }
   );
}
