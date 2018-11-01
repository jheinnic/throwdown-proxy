import {SymbolEnum} from '@jchptf/api';

type RandomArtTypes = 'RandomArtGenerator' | 'CanvasCalculator' | 'CanvasWriter';

export const RANDOM_ART_TYPES: SymbolEnum<RandomArtTypes> = {
   RandomArtGenerator: Symbol.for('RandomArtGenerator'),
   CanvasCalculator: Symbol.for('CanvasCalculator'),
   CanvasWriter: Symbol.for('CanvasWriter')
};