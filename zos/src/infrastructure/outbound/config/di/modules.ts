import {SymbolEnum} from '../../lib';

type ConfigLoaderModuleTypes = 'ConfigLoaderModule';

export const MODULES: SymbolEnum<ConfigLoaderModuleTypes> = {
   ConfigLoaderModule: Symbol.for('ConfigLoaderModule')
};