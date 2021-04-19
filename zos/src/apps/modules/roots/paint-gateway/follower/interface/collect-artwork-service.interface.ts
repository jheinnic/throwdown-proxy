import { IArtworkSeed } from './model';
import { UUID } from '../../../../../../infrastructure/validation';
import { IncrementalPlotProgress } from './incremental-plot-progress.interface';
import { Observable } from 'rxjs';

export interface ICollectArtworkService {
   registerTask(
      taskId: UUID,
      modelSeed: IArtworkSeed,
      // path: Path,
      renderPolicyUuid: UUID,
      storagePolicyUuid: UUID
   ): void;

   monitorTask(taskId: UUID): Observable<IncrementalPlotProgress>

   cancelTask(taskId: UUID, autoAck?: boolean): void;

   beginTask(taskId: UUID, autoAck?: boolean): void;

   sendAck(taskId: UUID): void;
}