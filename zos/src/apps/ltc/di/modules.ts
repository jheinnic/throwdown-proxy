import {SymbolEnum} from '@jchptf/api';

type LtcAppModuleTypes = 'ConfigurationModule' | 'LocalDirectoryRecordStoreModule';

export const LTC_APP_MODULES: SymbolEnum<LtcAppModuleTypes> = {
   ConfigurationModule: Symbol.for('ConfigurationModule'),
   LocalDirectoryRecordStoreModule: Symbol.for('LocalDirectoryRecordStoreModule')
};