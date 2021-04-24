import { Canvas } from 'canvas';

import { UUID } from '../../../../../../../infrastructure/validation';
import {IArtworkSeed} from './artwork-seed.interface';

export interface RenderingStepDefinition
{
   readonly taskId: UUID;
   readonly renderPolicy: UUID;
   readonly canvas: Canvas;
   readonly modelSeed: IArtworkSeed;
   readonly paintEngineVersion: string;
}


