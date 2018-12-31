import {IBagOf} from '@jchptf/api';

type ConfigTypeNames = "ConfigLoader"; // | "RootConfigPath"

export const CONFIG_TYPES: IBagOf<symbol, ConfigTypeNames> = {
   ConfigLoader: Symbol.for("ConfigLoader")
   // RootConfigPath: Symbol.for("RootConfigPath")
};