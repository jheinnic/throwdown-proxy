import {SymbolEnum} from '../lib/index';

type CommonTags = 'VariantFor' | 'CuratorOf';

export const COMMON_TAGS: SymbolEnum<CommonTags> = {
   VariantFor: Symbol.for('VariantFor'),
   CuratorOf: Symbol.for('CuratorOf')
};
