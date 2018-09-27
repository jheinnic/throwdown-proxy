import {SymbolEnum} from '../../lib/index';

type RecordListTags = 'BackingStorage' | 'RecordSetCurator';

export const RECORD_LIST_TAGS: SymbolEnum<RecordListTags> = {
   BackingStorage: Symbol.for('BackingStorage'),
   RecordSetCurator: Symbol.for('RecordSetCurator')
};

type BackingStorageTypes = 'LocalDirectory' | 'Vault';

export const BACKING_STORAGE_TYPES: SymbolEnum<BackingStorageTypes> = {
   LocalDirectory: Symbol.for('LocalDirectory'),
   Vault: Symbol.for('Vault')
};


export const A: SymbolEnum = {
   d: Symbol.for('fdfd')
}