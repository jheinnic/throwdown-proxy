import {SymbolEnum} from '@jchptf/api';

type WorldLibraryTypes = 'WorldLibrary' | 'Extensicutable' | 'ExtendMe';

export const WORLD_LIBRARY_TYPES: SymbolEnum<WorldLibraryTypes> = {
   WorldLibrary: Symbol('WorldLibrary'),
   Extensicutable: Symbol('Extensicutable'),
   ExtendMe: Symbol('ExtendMe')
}