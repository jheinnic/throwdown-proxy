import {SymbolEnum} from '../../../infrastructure/lib';

type LtcAppModuleTypes = 'ConfigurationModule' | 'LocalDirectoryRecordStoreModule';

export const LTC_APP_MODULES: SymbolEnum<LtcAppModuleTypes> = {
   ConfigurationModule: Symbol.for('ConfigurationModule'),
   LocalDirectoryRecordStoreModule: Symbol.for('LocalDirectoryRecordStoreModule')
};