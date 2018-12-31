import {SymbolEnum} from '@jchptf/api';

type LibTypes = 'AutoIterate' | 'RxjsScheduler' | 'UuidFactory';

export const LIB_DI_TYPES: SymbolEnum<LibTypes> = {
   AutoIterate: Symbol.for('AutoIterate'),
   RxjsScheduler: Symbol.for('RxjsScheduler'),
   UuidFactory: Symbol.for('UuidFactory')
}