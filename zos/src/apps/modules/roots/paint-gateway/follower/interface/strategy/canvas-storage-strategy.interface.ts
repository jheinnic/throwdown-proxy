import { Canvas } from 'canvas';

import { Path } from 'infrastructure/validation';

export interface ICanvasStorageStrategy
{
   store(path: Path, canvas: Canvas): Promise<boolean>;
}
// export type ICanvasStorageStrategy =
//    (taskId: UUID, storagePath: Path, canvas: Canvas) => Promise<UUID>