import {SymbolEnum} from '../../lib/index';

type ConfigTypeNames = "ConfigLoader" | "RootConfigPath"

export const CONFIG_TYPES: SymbolEnum<ConfigTypeNames> = {
   ConfigLoader: Symbol.for("ConfigLoader"),
   RootConfigPath: Symbol.for("RootConfigPath")
};