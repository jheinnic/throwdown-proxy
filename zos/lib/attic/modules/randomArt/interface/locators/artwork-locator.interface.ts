import {Name, Path, UUID} from '../../../../infrastructure/validation/index';
import {CanvasDimensions} from './canvas-dimensions.interface';
import {ModelSeed} from './model-seed.interface';
import {RenderScale} from './render-scale.interface';

export interface ArtworkLocator
{
   // readonly locatorPath: Path;
   // readonly renderPolicy: Name;
   // readonly configVersion: UUID;
   readonly modelSeed: ModelSeed;
   readonly canvasDimensions: CanvasDimensions;
   readonly renderScale: RenderScale;
   readonly frameworkVersion: string;
}


