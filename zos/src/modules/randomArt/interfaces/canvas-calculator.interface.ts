import {IncrementalPlotterFactory} from './incremental-plotter-factory.interface';
import {ConcreteFactoryService} from '@jchptf/di-app-registry';

export interface ICanvasCalculator
   extends ConcreteFactoryService<'create', IncrementalPlotterFactory, [number, number, number, ('fit' | 'fill' | 'square')?, number?, number?]>
{
   /**
    *
    * @param maxPointsPerSlice Maximum number of points to allocate per slice when dividing the
    * overall region into batches.
    * @param xCount
    * @param yCount
    * @param fitOrFill Determines whether rectangular regions zoom in or zoom out by deciding
    * which dimension aligns with the scaleFactor.
    * @param scaleFactor Determines the range of model that is included in the canvas.  By default,
    * 1.0 charts from [-1.0, 1.0] in a square region, and rectangular regions either zoom in or
    * zoom out to fit (one dimension becomes larger) or fill (one dimension becomes shorter)
    * @param pixelMultiplier For preview plots, set this to an odd number that evenly divides both
    * the height and width.  Instead of unit pixels, the plot will contain MxM sized pixels where
    * the color is selects using only what the model reports about the center pixel from that
    * square region.  Being an even multiple ensures there are no clipped pixels.  Being odd makes
    * it possible to take a color sample from the middle of the region, with no bias in any of
    * the four cardinal directions.
    */
   create(
      maxPointsPerSlice: number, xCount: number, yCount: number,
      fitOrFill?: 'fit' | 'fill' | 'square', scaleFactor?: number,
      pixelMultiplier?: number): IncrementalPlotterFactory
}