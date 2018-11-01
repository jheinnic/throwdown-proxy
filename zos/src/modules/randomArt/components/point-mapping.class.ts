import {IterableX, range} from 'ix/iterable';
import {startWith} from 'ix/iterable/pipe/startWith';
import {flatMap} from 'ix/iterable/pipe/flatmap';
import {memoize} from 'ix/iterable/pipe/memoize';
import {buffer} from 'ix/iterable/pipe/buffer';
import {tap} from 'ix/iterable/pipe/tap';
import {map} from 'ix/iterable/pipe/map';
import {Canvas} from 'canvas';
import ndarray from 'ndarray';

import {
   IncrementalPlotObserver, IncrementalPlotter, IncrementalPlotterFactory, MappedPoint,
   IncrementalPlotProgress
} from '../interfaces';
import {PlottingPartialObserver} from './plotting-partial-observer.class';

export class PointMapping implements IncrementalPlotterFactory
{
   private mappedPoints: IterableX<MappedPoint>;

   public constructor(
      xCount: number,
      yCount: number,
      pixelMulti: number,
      dataArray: Float64Array,
      private readonly sliceCount: number,
      private readonly sliceSize: number)
   {
      const ndDataArray = ndarray(dataArray, [xCount / pixelMulti, yCount / pixelMulti, 2]);

      this.mappedPoints = range(0, xCount / pixelMulti)
         .pipe(
            flatMap((xCanvas: number): Iterable<MappedPoint> =>
               range(0, yCount / pixelMulti)
                  .pipe(
                     map((yCanvas: number) =>
                        [
                           xCanvas * pixelMulti, yCanvas * pixelMulti,
                           ndDataArray.get(xCanvas, yCanvas, 0),
                           ndDataArray.get(xCanvas, yCanvas, 1)
                        ] as MappedPoint)
                  )
            ),
            memoize(xCount * yCount / pixelMulti / pixelMulti)
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


