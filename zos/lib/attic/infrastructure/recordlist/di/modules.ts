import {SymbolEnum} from '@jchptf/api';

type RecordListModuleTypes = 'LocalDirectoryRecordStoreModule';

export const RECORD_LIST_MODULES: SymbolEnum<RecordListModuleTypes> = {
   LocalDirectoryRecordStoreModule: Symbol.for('LocalDirectoryRecordStoreModule')
};