import {IterableX, range} from 'ix/iterable';
import {flatMap} from 'ix/iterable/pipe/flatmap';
import {memoize} from 'ix/iterable/pipe/memoize';
import {take} from 'ix/iterable/pipe/take';
import {skip} from 'ix/iterable/pipe/skip';
import {tap} from 'ix/iterable/pipe/tap';
import {map} from 'ix/iterable/pipe/map';
import ndarray from 'ndarray';

import {
   IncrementalPlotObserver, IncrementalPlotter, IncrementalPlotterFactory, MappedPoint
} from '../interfaces';
import {PlottingPartialObserver} from './plotting-partial-observer.class';
import {Canvas} from 'canvas';

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
      // console.log(dataArray);

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

      // this.mappedPoints.forEach((projection) => {
      //    console.log(projection);
      // });
      // tap(
      //    { next: function() {
      //       console.log('AB');
      //    }}
      // )
   }

   public createMapIter(callback: IncrementalPlotObserver): IterableX<MappedPoint>
   {
      console.log('Calling create IncrementalPlotter');
      const tapObserver = new PlottingPartialObserver(callback);
      return this.mappedPoints.pipe(
         tap(tapObserver)
      );
   }

   public* create(callback: IncrementalPlotObserver): IncrementalPlotter
   {
      const pointIter = this.createMapIter(callback);
      const termIndex = this.sliceCount;

      for (let ii = 1; ii <= termIndex; ii++) {
         const _work = [ ...pointIter.pipe(
            skip(this.sliceSize * (ii - 1)),
            take(this.sliceSize)
         )];
         // console.log(_work);
         if (_work.length > 0) {
            console.log({
               done: ii,
               remaining: termIndex - ii,
               total: termIndex
            });
            yield {
               done: ii,
               remaining: termIndex - ii,
               total: termIndex
            };
         }
      }

      // yield {
      //    done: termIndex,
      //    remaining: 0,
      //    total: termIndex
      // };
   }

   public isCompatible(_canvas: Canvas): boolean
   {
      return true;
   }
}


