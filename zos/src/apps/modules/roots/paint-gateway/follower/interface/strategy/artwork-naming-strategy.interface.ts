import { Path } from 'infrastructure/validation';
import { IArtworkSeed } from '../model';

export interface IArtworkNamingStrategy
{
   toName(modelSeed: IArtworkSeed): Path;
}
// export type ICanvasStorageStrategy =
//    (taskId: UUID, storagePath: Path, canvas: Canvas) => Promise<UUID>