import { IModelSeed } from './model';
import { Path, UUID } from '../../../../../../infrastructure/validation';
import { IncrementalPlotProgress } from './incremental-plot-progress.interface';
import { Observable } from 'rxjs';

export interface ICollectArtworkService {
   registerTask(
      modelSeed: IModelSeed,
      path: Path,
      renderPolicyUuid: UUID,
      storagePolicyUuid: UUID
   ): UUID;

   monitorTask(taskId: UUID): Observable<IncrementalPlotProgress>

   cancelTask(taskId: UUID, autoAck?: boolean): void;

   beginTask(taskId: UUID, autoAck?: boolean): void;

   sendAck(taskId: UUID): void;
}