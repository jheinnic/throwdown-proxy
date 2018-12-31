import {SymbolEnum} from '@jchptf/api';

type RandomKeySourceScope = 'root' | 'iteration';

export const RANDOM_KEY_SOURCE_SCOPE: SymbolEnum<RandomKeySourceScope> = {
    root: Symbol('root'),
   iteration: Symbol('iteration')
};