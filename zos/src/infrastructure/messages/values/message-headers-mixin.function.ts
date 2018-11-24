import {makeChainingHandler, mixinPlus} from '@jchptf/api';
import {MessageHeaders} from '../interfaces/message-headers.interface';
import {HeadersConstructor} from '../interfaces/headers-constructor.interface';
import {Merge} from 'simplytyped';

export function messageHeadersMixin<O extends MessageHeaders>(defaultBehavior: Partial<O>):
   <I extends MessageHeaders>(input: HeadersConstructor<I>) => HeadersConstructor<Merge<I, O>>
{
   // The following cast relaxes the constraint on omitting "constructor" and "with", but it does
   // so after having enforced that constraint on user-provided input, so it is Ok to now treat these
   // properties as optionally omitted, since we will not add them incorrectly ourselves.
   // const behaveTwo: Partial<T> = behavior as unknown as Partial<T>;

   return mixinPlus<O>({
      behavior: defaultBehavior,
      conflicts: {
         init: makeChainingHandler((_base: any, _mixin: any): any => {
            console.log('Merge', _base, 'to', _mixin);
            return Object.assign({}, _base, _mixin);
         })
      }
   });
}