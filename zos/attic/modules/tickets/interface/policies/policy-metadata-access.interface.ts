import {
   ImageStyleMetadata, ImageStyleName, ModelSeedStrategyMetadata, ModelSeedStrategyName,
   RenderStyleMetadata, RenderStyleName
} from '../index';
import {UUID} from '../../../../infrastructure/validation';

export interface IPolicyMetadataAccess {
   getConfigVersion(): UUID;

   findSeedStrategyByName(name: ModelSeedStrategyName): ModelSeedStrategyMetadata;

   findImageStyleByName(name: ImageStyleName): ImageStyleMetadata;

   findRenderStyleByName(name: RenderStyleName): RenderStyleMetadata;

   findRenderStylesByName(names: Iterable<RenderStyleName>): Iterable<RenderStyleMetadata>;

   findRenderStylesByImageStyleName(name: ImageStyleName): Iterable<RenderStyleMetadata>;
}