import {SymbolEnum} from '@jchptf/api';

type ConfigLoaderModuleTypes = 'ConfigLoaderModule';

export const MODULES: SymbolEnum<ConfigLoaderModuleTypes> = {
   ConfigLoaderModule: Symbol.for('ConfigLoaderModule')
};