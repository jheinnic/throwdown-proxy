import {SymbolEnum} from '../../lib/index';

type RecordListTypes =
   'RecordList' | 'LocalDirectory';

export const RECORD_LIST_TYPES: SymbolEnum<RecordListTypes> = {
   RecordList: Symbol.for('RecordList'),
   LocalDirectory: Symbol.for('LocalDirectory')
}