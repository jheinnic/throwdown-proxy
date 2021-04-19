import {Name, UUID} from '../../../../../../../../infrastructure/validation';
import {PlotGridData} from './plot-grid-data.interface';

export interface DeployedRenderingPolicy
{
   readonly uuid: UUID;
   readonly displayName: Name;
   // readonly canvasDimensions: CanvasDimensions;
   // readonly renderScale: RenderScale;
   readonly plotGridData: PlotGridData;
   readonly paintEngineVersion: string;
}


