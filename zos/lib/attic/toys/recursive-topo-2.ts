// @ts-ignore
import iota from "iota";
// @ts-ignore
import topo from "topo";

interface SubtreeOptions { 
   group: number,
   after: number[],
   currentWidth?: number
}

export class RecursiveTopoFactoryWatDwo
{
   private factor = 1;
   private endIndex = 1;
   private workStack: Array<SubtreeOptions> = [];

   private topTree = new topo();

   public new(private readonly rootIndex: number, private readonly endIndex: number, private readonly subtreeDepth: number)
   {
      this.factor = Math.pow(2, subtreeDepth);
      this.endIndex = endIndex;
   }

   public runIt(): void {

      iota.set(this.factor - 1);
      let nextLeaves = new Array(this.factor);
      for (let ii = 0; ii < this.factor; ii++) {
         nextLeaves[ii] = iota();
      }

      let currentRoot = this.rootIndex;
      let currentWidth = 1;
      let firstNextLeaf = this.factor - 1;

      this.populateTopo(currentRoot, currentWidth, nextLeaves);

      while (this.workStack.length > 0) {
         const opts = this.workStack.pop();
         if ((!!opts) && opts.currentWidth && (opts.currentWidth > currentWidth)) {
            // The tree will overflow if not expanded here!
            firstNextLeaf = ((firstNextLeaf + 1) * this.factor) - 1;
            iota.set(firstNextLeaf);
            currentWidth = opts.currentWidth;

            if (firstNextLeaf > this.endIndex) {
               console.error('Aborting at transition to partial node layer, which is still TBD for'
                 + ' handling');
               break;
            }
        }

         this.populateTopo(currentRoot, currentWidth, nextLeaves);
      }

      console.log(this.topTree.nodes());
      console.log(JSON.stringify(this.topTree.nodes()));
   }

   populateTopo( currentRoot: number, currentWidth: number, nextLeaves: number[]): void {
      console.log(`Call to populateTopo(${currentRoot}, ${currentWidth}, ${nextLeaves})`);

      const loopTerminal = Math.min(currentRoot + currentWidth, this.endIndex);
      for (; currentRoot < loopTerminal; currentRoot++) {
        const opts: SubtreeOptions = {
           group: currentRoot,
           after: nextLeaves.map(iota)
        };
        this.topTree.add(currentRoot, opts);

        opts.currentWidth = currentWidth * this.factor;
        this.workStack.push(opts);
      }
   }
}

let test = new RecursiveTopoFactoryWatDwo, (0, 500000, 4);
test.runIt();

