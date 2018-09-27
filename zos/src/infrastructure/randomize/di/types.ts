import {SymbolEnum} from '../../lib/index';

type RandomizeTypeNames = 'SeedBytes' | 'RandomGeneratorService' | 'PseudoRandomGeneratorService' | 'RandomGenerator' | 'PseudoRandomGenerator';

export const RANDOMIZE_TYPES: SymbolEnum<RandomizeTypeNames> = {
   SeedBytes: Symbol.for('SeedBytes'),
   RandomGeneratorService: Symbol.for('RandomGeneratorService'),
   PseudoRandomGeneratorService: Symbol.for('PseudoRandomGeneratorService'),
   RandomGenerator: Symbol.for('RandomGenerator'),
   PseudoRandomGenerator: Symbol.for('PseudoRandomGenerator'),
};