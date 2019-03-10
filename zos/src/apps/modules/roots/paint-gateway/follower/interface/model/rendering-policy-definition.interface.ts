import {Name, UUID} from '../../../../infrastructure/validation';
import {CanvasDimensions} from './canvas-dimensions.interface';
import {RenderScale} from './render-scale.interface';
import {PlotGridData} from './plot-grid-data.interface';

export interface RenderingPolicyDefinition
{
   readonly uuid: UUID;
   readonly displayName: Name;
   readonly canvasDimensions: CanvasDimensions;
   readonly renderScale: RenderScale;
   readonly plotGridData: PlotGridData;
   readonly paintEngineVersion: string;
}


