import { Canvas } from 'canvas';
import { Path, UUID } from '../../../../../../infrastructure/validation';

export interface ICanvasStoragePolicy
{
   store(uuid: UUID, path: Path, canvas: Canvas): Promise<UUID>;
}
// export type ICanvasStoragePolicy =
//    (taskId: UUID, storagePath: Path, canvas: Canvas) => Promise<UUID>