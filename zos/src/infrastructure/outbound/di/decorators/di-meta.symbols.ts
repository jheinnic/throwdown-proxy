import {SymbolEnum} from '../../lib';

type diMetaTypes = 'diModules' | 'asyncProviderMethods' | 'syncProviderMethods' | 'diTemplates';

export const DI_META: SymbolEnum<diMetaTypes> = {
   diModules: Symbol.for('diModules'),
   asyncProviderMethods: Symbol.for('asyncProviderMethods'),
   syncProviderMethods: Symbol.for('syncProviderMethods'),
   diTemplates: Symbol.for('diTemplates')
};