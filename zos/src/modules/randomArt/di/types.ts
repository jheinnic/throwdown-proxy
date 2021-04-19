import {SymbolEnum} from '@jchptf/api';

type RandomArtTypes = 'RandomArtGenerator' | 'CanvasCalculator' | 'CanvasWriter' | 'CanvasPathMapper' | 'RootPathName';

export const RANDOM_ART_TYPES: SymbolEnum<RandomArtTypes> = {
   RandomArtGenerator: Symbol('RandomArtGenerator'),
   CanvasCalculator: Symbol('CanvasCalculator'),
   CanvasWriter: Symbol('FilesystemCanvasWriter'),
   CanvasPathMapper: Symbol('CanvasPathMapper'),
   RootPathName: Symbol('RootPathName')
};