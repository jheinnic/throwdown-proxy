import {Iterable} from '@reactivex/ix-ts';
import {PointMap} from '../components';
import {TaskIdentity, PaintingArtifacts} from '.';

export class PaintEngineTaskModel
{
   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly paintingArtifacts: PaintingArtifacts,
      public readonly pointMapBatches: Iterable<Iterable<PointMap>>,
      public readonly relativeOutputPath: string
   ) { }

}
