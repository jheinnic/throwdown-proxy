import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import {CanvasAndPlotModel} from './canvas-and-plot-model.interface';

export class CanvasPlotter
{
  paintThenEmit(nextTask: CanvasAndPlotModel): Observable<number>
  {
    // Concatenate the reduction of each point map batch to yield an incrementally painted canvas.  The
    // concatenate operator ensures that only one batch is consumed this way at a time.  Then, skip over
    // each concatenated result except the last by reducing the sequence of reduced batches.  The resulting
    // stream will emit a single arbitrary value when the entire painting task is complete.  The value is
    // arbitrary insofar as caller is only interested in knowing when its emitted, not what that value was.
    // A boolean value of true is used to facilitate a simple single() operator at the terminus as a
    // correctness safeguard and expression of intent.
    console.log(nextTask);
    let batchCount = 72;
    nextTask.pointMapBatches.count(
      (batch) => {
        console.log(`Counting points from ${batch}`);
        batch.count()
          .subscribe(
            (input) => {
              console.log(`A Batch contains ${input} point maps`);
            },
            (err) => {
              console.error(`Failed to count a batch: ${err}`);
            },
            () => {
              console.log(`Complete signal for counting ${batch}`);
            }
          );
        return true;
      }
    )
      .subscribe(
        (input) => {
          batchCount = input;
          console.log(`Counted ${input} batches`);
        },
        (err) => {
          console.error(`Failed to count a workload: ${err}`);
        },
        () => {
          console.log(`Complete signal for outer counting`);
        }
      ).unsubscribe();

    return nextTask.pointMapBatches.take(batchCount - 1).concatMap(
      nextBatch => {
        // nextBatch.count()
        //   .subscribe(
        //     (input) => {
        //       console.log(`B Batch contains ${input} point maps`);
        //     }
        //   );

        return nextBatch.reduce(
          (acc, nextPointMap) => {
            nextPointMap.render(nextTask.genModel, nextTask.paintContext)
            return acc + 1;
          }, 0
        );
      }
    )
      .do(pointCount => {
        console.log('Post-concat pre-reduce returning ', pointCount);
      })
      .reduce((acc: number, value: number) => {
          console.log(`Adding ${value} to ${acc}`);
          return acc + value;
        }, 0
      )
      .do(pointCount => {
        console.log('Post-reduce returning ', pointCount);
      });
      // .single((value: number) => value === (nextTask.canvas.width * nextTask.canvas.height));
  }
}
