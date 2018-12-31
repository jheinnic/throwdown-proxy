import {SymbolEnum} from '@jchptf/api';

type CommonTags = 'VariantFor' | 'CuratorOf';

export const COMMON_TAGS: SymbolEnum<CommonTags> = {
   VariantFor: Symbol.for('VariantFor'),
   CuratorOf: Symbol.for('CuratorOf')
};
