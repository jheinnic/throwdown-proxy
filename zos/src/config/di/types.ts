import {SymbolEnum} from '../../di';

type ConfigTypeNames = "ConfigLoader" | "BootstrapSchema" | "RootConfigPath"

export const CONFIG_TYPES: SymbolEnum<ConfigTypeNames> = {
   ConfigLoader: Symbol.for("ConfigLoader"),
   BootstrapSchema: Symbol.for("BootstrapSchema"),
   RootConfigPath: Symbol.for("RootConfigPath")
};