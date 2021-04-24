import { UUID } from '../../../../../../infrastructure/validation';
import { IArtworkSeed } from './index';
import { Canvas } from 'canvas';

export interface IStoragePolicy
{
   applyPolicy(uuid: UUID, seed: IArtworkSeed, canvas: Canvas): ICanvasStoragePolicy;
}