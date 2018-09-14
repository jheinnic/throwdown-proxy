export type SymbolEnum<T extends string = string> = {
   [K in T]: symbol
}