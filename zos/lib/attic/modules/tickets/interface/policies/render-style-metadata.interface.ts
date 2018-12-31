import {ImageStyleMetadata} from './image-style-metadata.interface';
import {ModelSeedStrategyMetadata} from './model-seed-metadata.interface';
import {RenderStyleName} from './render-style-name.type';

export interface RenderStyleMetadata
{
   readonly name: RenderStyleName;
   readonly imageStyle: ImageStyleMetadata
   readonly seedStrategy: ModelSeedStrategyMetadata;
}
