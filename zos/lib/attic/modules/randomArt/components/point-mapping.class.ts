import {IterableX} from 'ix/iterable';
import {startWith} from 'ix/iterable/pipe/startWith';
import {flatMap} from 'ix/iterable/pipe/flatmap';
import {memoize} from 'ix/iterable/pipe/memoize';
import {buffer} from 'ix/iterable/pipe/buffer';
import {tap} from 'ix/iterable/pipe/tap';
import {map} from 'ix/iterable/pipe/map';
import {Canvas} from 'canvas';
import ndarray from 'ndarray';

import {stepRange} from '../../../../../src/infrastructure/lib';
import {PlottingPartialObserver} from './plotting-partial-observer.class';
import {
   IncrementalPlotObserver, IncrementalPlotter, IncrementalPlotterFactory,
   IncrementalPlotProgress, PlotGridData, MappedPoint
} from '../interface';

export class PointMapping implements IncrementalPlotterFactory
{
   private mappedPoints: IterableX<MappedPoint>;

   public constructor(
      plotGridData: PlotGridData,
      private readonly sliceCount: number,
      private readonly sliceSize: number)
   {
      const { xCount, yCount, pixelMulti, dataArray } = plotGridData;
      const ndDataArray = ndarray(dataArray, [xCount / pixelMulti, yCount / pixelMulti, 2]);
      const xPointCount = xCount / pixelMulti;
      const yPointCount = yCount / pixelMulti;

      this.mappedPoints = stepRange(0, xPointCount, pixelMulti)
         .pipe(
            flatMap((xCanvas: [number, number]): Iterable<MappedPoint> =>
               stepRange(0, yPointCount, pixelMulti)
                  .pipe(
                     map((yCanvas: [number, number]) =>
                        [
                           xCanvas[0], yCanvas[0],
                           ndDataArray.get(xCanvas[1], yCanvas[1], 0),
                           ndDataArray.get(xCanvas[1], yCanvas[1], 1)
                        ] as MappedPoint)
                  )
            ),
            memoize(xPointCount * yPointCount)
         );
   }

   public create(callback: IncrementalPlotObserver): IncrementalPlotter
   {
      console.log('Calling create IncrementalPlotter');
      var retVal: IncrementalPlotter =
         this.mappedPoints.pipe(
            tap(
               new PlottingPartialObserver(callback)),
            buffer(this.sliceSize),
            startWith([] as MappedPoint[]),
            map<MappedPoint[], IncrementalPlotProgress>(
               (_value: MappedPoint[], ii: number) => (
                  {
                     plotter: retVal,
                     done: ii,
                     remaining: this.sliceCount - ii,
                     total: this.sliceCount
                  }
               )
            ));

      return retVal;
   }

   public isCompatible(_canvas: Canvas): boolean
   {
      return true;
   }
}


