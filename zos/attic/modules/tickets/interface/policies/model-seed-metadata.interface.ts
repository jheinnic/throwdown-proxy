import {ModelSeedStrategyName, RenderStyleName} from '.';
import {IPaintModelSeedStrategy} from '..';

export interface ModelSeedStrategyMetadata {
   readonly name: ModelSeedStrategyName;
   // readonly useNewModel: boolean;
   // readonly xDimension: DimensionSeedMetadata;
   // readonly yDimension: DimensionSeedMetadata;
   readonly renderStyles: ReadonlyArray<RenderStyleName>;
   readonly modelSeedStrategy: IPaintModelSeedStrategy;
}