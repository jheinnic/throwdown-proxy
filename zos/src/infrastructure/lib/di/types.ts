import {SymbolEnum} from '@jchptf/api';

type LibDiTypes = 'AutoIterate' | 'RxjsScheduler';

export const LIB_DI_TYPES: SymbolEnum<LibDiTypes> = {
   AutoIterate: Symbol["for"]('AutoIterate'),
   RxjsScheduler: Symbol["for"]('RxjsScheduler')
};
