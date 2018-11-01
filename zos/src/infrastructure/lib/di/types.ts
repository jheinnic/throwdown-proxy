import {SymbolEnum} from '@jchptf/api';

type LibTypes = 'AutoIterate' | 'RxjsScheduler';

export const LIB_DI_TYPES: SymbolEnum<LibTypes> = {
   AutoIterate: Symbol.for('AutoIterate'),
   RxjsScheduler: Symbol.for('RxjsScheduler')
}