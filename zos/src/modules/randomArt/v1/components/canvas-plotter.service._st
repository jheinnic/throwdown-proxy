import {OperatorFunction} from 'rxjs';
import {concatMap, mapTo, reduce, tap} from 'rxjs/operators';

import {CanvasAndPlotModel, WriteToFileContext} from '../interfaces/index';
import {PointMap} from './index';

export class CanvasPlotter
{
   paintThenEmit(): OperatorFunction<CanvasAndPlotModel, WriteToFileContext>
   {
      return concatMap((nextTask: CanvasAndPlotModel) => {
         console.log(`Concat map working at ${nextTask}`);
         return nextTask.pointMapBatches.pipe(
            tap(console.log),
            reduce((acc: number, nextPointMap: PointMap): number => {
               nextPointMap.render(nextTask.genModel, nextTask.paintContext);
               return acc + 1;
            }, 0),
            tap(pointCount => {
               console.log('Post-concat-reduce returning ', pointCount);
            }),
            mapTo({
               canvas: nextTask.canvas,
               outputFilePath: nextTask.outputFilePath
            })
         )
      });
      // reduce((acc: number, value: number) => {
      //       console.log(`Adding ${value} to ${acc}`);
      //       return acc + value;
      //    }, 0
      // ),
      // tap(pointCount => {
      //    console.log('Post-reduce returning ', pointCount);
      // })
      // )
   }

// paintThenEmit(nextTask: CanvasAndPlotModel): Observable<number>
// {
//    // Concatenate the reduction of each point map batch to yield an incrementally painted canvas.  The
//    // concatenate operator ensures that only one batch is consumed this way at a time.  Then, skip over
//    // each concatenated result except the last by reducing the sequence of reduced batches.  The
// resulting // stream will emit a single arbitrary value when the entire painting task is complete.  The
// value is // arbitrary insofar as caller is only interested in knowing when its emitted, not what that
// value was. // A boolean value of true is used to facilitate a simple single() operator at the terminus
// as a // correctness safeguard and expression of intent. // console.log(nextTask:
// <Observable<Observable<PointMap>>); let batchCount = 72; nextTask.pointMapBatches.pipe( tap((batch:
// Observable<PointMap>) => { console.log(`Counting points from ${batch}`) batch.pipe(count()) .subscribe(
// (input: any) => { console.log(`A Batch contains ${input} point maps`); }, (err: any) => {
// console.error(`Failed to count a batch: ${err}`); }, () => { console.log(`Complete signal for counting
// ${batch}`); } ); return true; } )) .subscribe( (input) => { // batchCount = input; console.log(`Counted
// ${input} batches`); }, (err) => { console.error(`Failed to count a workload: ${err}`); }, () => { console.log(`Complete signal for outer counting`); } ) .unsubscribe();  return nextTask.pointMapBatches.pipe( take(batchCount - 1), concatMap( nextBatch => { // nextBatch.count() //   .subscribe( //     (input) => { //       console.log(`B Batch contains ${input} point maps`); //     } //   );  return nextBatch.pipe(reduce( (acc: number, nextPointMap: PointMap): number => { nextPointMap.render(nextTask.genModel, nextTask.paintContext) return acc + 1; }, 0 )); } ), tap(pointCount => { console.log('Post-concat pre-reduce returning ', pointCount); }), reduce((acc: number, value: number) => { console.log(`Adding ${value} to ${acc}`); return acc + value; }, 0 ), tap(pointCount => { console.log('Post-reduce returning ', pointCount); }) ); };

}
