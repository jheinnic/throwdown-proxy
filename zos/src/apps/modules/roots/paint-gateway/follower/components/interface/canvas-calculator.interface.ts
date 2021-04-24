import { CanvasDimensions, PlotGridData, RenderScale } from './model';
import { IArtworkRenderer } from './artwork-renderer.interface';

export interface ICanvasCalculator
{
   /*
    * Hacky shortcut method that retrieves both the PlotGridData and IWorkPartitions for given
    * inputs and uses the pair of values to construct an IArtworkRenderer.
    *
    * The intended use of these abstractions is for PlotGridData to be computed once and then
    * stored under the key of a model rendering policy ID.  At runtime, that policy is combined
    * with a partitioning requirement to yield the IWorkPartitions needed to configure the
    * runtime implementor of IArtworkRenderer.
    *
    * @param maxPointsPerSlice Maximum number of points to allocate per slice when dividing the
    * overall region into batches.
    * @param canvasDimensions
    * @param renderScale
   create(
      maxPointsPerSlice: number,
      canvasDimensions: CanvasDimensions,
      renderScale?: RenderScale
   ): IModelRenderingPolicy
   */

   computePoints(
      canvasDimensions: CanvasDimensions,
      renderScale?: RenderScale
   ): PlotGridData

   computePartitions(
      plotGridData: PlotGridData,
      maxPointsPerSlice: number
   ): IArtworkRenderer
}