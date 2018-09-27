import {SymbolEnum} from '../../lib/index';

type ConfigLoaderModuleTypes = 'ConfigLoaderModule';

export const MODULES: SymbolEnum<ConfigLoaderModuleTypes> = {
   ConfigLoaderModule: Symbol.for('ConfigLoaderModule')
};