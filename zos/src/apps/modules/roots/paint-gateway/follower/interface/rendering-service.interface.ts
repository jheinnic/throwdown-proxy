import { Canvas } from 'canvas';

import { UUID } from '../../../../../../infrastructure/validation';
import { IncrementalPlotter, IRandomArtworkModel } from '../components/interface';

export interface IRenderingPolicy
{
   applyPolicy(
      policyId: UUID, genModel: IRandomArtworkModel, canvas: Canvas, resizeCanvasOk?: boolean
   ): IncrementalPlotter
}