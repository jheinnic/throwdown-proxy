import { UUID } from '../../../../infrastructure/validation';
import {IModelSeed} from './model-seed.interface';
import { Canvas } from 'canvas';

export interface RenderingStepDefinition
{
   readonly taskId: UUID;
   readonly canvas: Canvas;
   readonly renderPolicy: UUID;
   readonly modelSeed: IModelSeed;
   readonly paintEngineVersion: string;
}


