// @ts-ignore
import iota from 'iota';
// @ts-ignore
import Topo from 'topo';
import {asapScheduler, concat, generate, Observable, range, zip} from 'rxjs';
import {distinct, finalize, flatMap, mapTo, share, skip} from 'rxjs/operators';

function replicate<T>(times: number) {
   return function(obs: Observable<T>) {
      return obs.pipe(
        flatMap(
          (item: T) => range(1, times).pipe(
            mapTo(item))));
   }
}

function repeatForever(value: any) {
   return generate({
      initialState: value,
      iterate: value => value,
      scheduler: asapScheduler
   });
}

/**
 * A winding count begins with zero at the root node of a tree, then advances to one at the left-most
 * node of the first left-hand traversal available.  The counting task proceeds to assign integers in
 * a monotonically increasing fashion until **See Code TODO.  Counting begins with the left-most
 * pathTo of the root node (a.k.a. highest available level), and follows a winding count's order.
 *
 * This implementation adapts the basic winding traversal slightly by skipping past some number of
 * levels at each descent such that the traversal only iterates through nodes that define a logical
 * partitioning of the overall tree into a forest of fixed-height, largely complete, sub-trees.
 */
interface SubtreeLocation
{
   /**
    * Identifies a node using the zero-based ordering sequence and skipping the desired number of
    * layers at each descent.
    */
   readonly nodeIndex: number,
   readonly depthIndex: number,
   readonly nextLevelAt: number,
}

export class RecursiveTopoFactory
{
   private factor: number = 1;
   private maxNodeIndex: number;
   private topo = new Topo();

   public constructor(
     private readonly treeDepth: number,
     private readonly subtreeDepth: number,
     maxNodeIndex: number)
   {
      this.factor = Math.pow(2, subtreeDepth);
      this.maxNodeIndex = Math.min(maxNodeIndex, Math.pow(2, treeDepth) - 1);
   }

   public run(): void
   {
      const computeRoots = generate<SubtreeLocation>({
         initialState: {
            nodeIndex: 0,
            depthIndex: 0,
            nextLevelAt: 0
         },
         condition: (x: SubtreeLocation) => {
            // console.log('Test:', x);
            return (x.nodeIndex < this.maxNodeIndex) && (x.depthIndex <= this.treeDepth);
         },
         iterate: (x: SubtreeLocation) => {
            if (x.nodeIndex < x.nextLevelAt) {
               return Object.assign({}, x, {nodeIndex: x.nodeIndex + 1});
            }
            console.log('X was on the right at', x);

            let depthIndex = x.depthIndex + this.subtreeDepth;
            if (depthIndex > this.treeDepth) {
               depthIndex = this.treeDepth;
            }

            const nodeIndex = Math.pow(2, depthIndex) - 1;
            const nextLevelAt = nodeIndex + nodeIndex;

            return {
               nodeIndex,
               depthIndex,
               nextLevelAt
            };
         }
      });

      const localRoots = computeRoots.pipe(share());

      const dependsUpon =
         concat(
            localRoots.pipe(
               skip(1)),
            repeatForever(null));

      const dependents =
         localRoots.pipe(
            replicate(this.factor)
         );

      zip(dependents, dependsUpon).pipe(
         distinct((pair: [SubtreeLocation, SubtreeLocation|null]) => {
            const dependsOn = pair[1];
            if (!!dependsOn) {
               return `${pair[0].nodeIndex}:${dependsOn.nodeIndex}`;
            } else {
               return pair[0].nodeIndex;
            }
         }),
        finalize(() => {
           console.log(JSON.stringify(this.topo.nodes));
        })
      ).subscribe(
         (pair: [SubtreeLocation, SubtreeLocation|null]) => {
            const dependsOn = pair[1];
            if (!!dependsOn) {
               // console.log(
               //    `(Node ${pair[0].nodeIndex} from level ${pair[0].depthIndex}) follows (Node
               // ${dependsOn.nodeIndex} from level ${dependsOn.depthIndex})`
               // );
               this.topo.add(dependsOn.nodeIndex, {group: dependsOn.nodeIndex, before: [pair[0].nodeIndex]})
            // } else {
               // console.log(
               //   `(Node ${pair[0].nodeIndex} from level ${pair[0].depthIndex}) depends on nothing.`
               // );
            }
         }
      );

      // counter.subscribe(
      //   (subtreeCount: number) => {
      //      console.log(`Counted ${subtreeCount} subtrees`);
      //   }
      // );

      console.log('Created pipeline');
      // console.log(this.topo.nodes);
      // console.log(JSON.stringify(this.topo.nodes));
      return;
   }

}

let test = new RecursiveTopoFactory(13, 4, 500000);
test.run();

