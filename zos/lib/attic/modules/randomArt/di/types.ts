import {SymbolEnum} from '@jchptf/api';

type RandomArtTypes = 'RandomArtGenerator' | 'CanvasCalculator' | 'CanvasWriter' | 'CanvasPathMapper' | 'RootPathName';

export const RANDOM_ART_TYPES: SymbolEnum<RandomArtTypes> = {
   RandomArtGenerator: Symbol.for('RandomArtGenerator'),
   CanvasCalculator: Symbol.for('CanvasCalculator'),
   CanvasWriter: Symbol.for('CanvasWriter'),
   CanvasPathMapper: Symbol.for('CanvasPathMapper'),
   RootPathName: Symbol.for('RootPathName')
};