import { Canvas } from 'canvas';

import { Path, UUID } from 'infrastructure/validation';
import { IModelSeed } from './model';

export interface ICanvasStoragePolicy
{
   store(
      uuid: UUID, modelSeed: IModelSeed, path: Path, canvas: Canvas
   ): Promise<UUID>;
}
// export type ICanvasStoragePolicy =
//    (taskId: UUID, storagePath: Path, canvas: Canvas) => Promise<UUID>