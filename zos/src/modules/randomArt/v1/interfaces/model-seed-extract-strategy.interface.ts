import {BitStrategyKind} from '../../../tickets/config/bit-strategy-kind.enum';

export interface IModelSeedExtractStrategy {
   strategyKey(): BitStrategyKind
   applyStrategy()
}