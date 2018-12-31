import {Observable, of, range, zip} from 'rxjs';
import {bufferCount, concatAll, concatMap, reduce} from 'rxjs/operators';

export class SubtreeRootOrderV0
{
   private readonly factor: number;

   private readonly treeDepth: number;

   private readonly tierCount: number;

   // private readonly firstLeafIndex: number;

   // private readonly lastLeafIndex: number;

   public constructor( private readonly subtreeDepth: number, leafCount: number)
   {
      this.factor = Math.pow(2, subtreeDepth);
      this.treeDepth = Math.ceil(Math.log2(leafCount));
      this.tierCount = Math.ceil(this.treeDepth / this.subtreeDepth);
      // this.firstLeafIndex = Math.pow(2, this.treeDepth - 1) - 1;
      // this.lastLeafIndex = this.firstLeafIndex + leafCapacity - 1;
   }

   public run(): void
   {
      range(1, this.tierCount - 1)
         .pipe(
            reduce(
               (innerSeq: Observable<number[]>, tierIndex: number) => {
                  const leftMostIndex = Math.pow(2, this.subtreeDepth * tierIndex) - 1;
                  const rightMostIndex = leftMostIndex * 2;

                  console.log(
                     'At tier', tierIndex, 'leftMost is', leftMostIndex, 'and rightMost is',
                     rightMostIndex);
                  const deeperRange = range(leftMostIndex, rightMostIndex);
                  return zip(
                     deeperRange.pipe(
                        bufferCount(this.factor)),
                     innerSeq)
                     .pipe(
                        concatMap((pair: number[][]) => [
                           ...pair[0].slice(0, this.factor - 1)
                              .map(value => [value]),
                           [pair[0][this.factor - 1], ...pair[1]]
                        ]),
                     );
               }, of([0])),
            concatAll(),
            concatAll()
         ).subscribe( (input) => { console.log(input); } );

      return;
   }
}

let test = new SubtreeRootOrderV0(3, 4096);
test.run();

