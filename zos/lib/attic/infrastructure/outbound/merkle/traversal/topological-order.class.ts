import {inject} from 'inversify';

import {LayerFor, MerkleDigestLocator, MerkleTreeDescription} from '../locator';
import {IMerkleCalculator} from '../interface';
import {MERKLE_TYPES} from '../di';

import '../../reflection';
import {TopoOrderOptions} from './topo-order-options.class';

export abstract class TopologicalOrder<Node extends MerkleDigestLocator = MerkleDigestLocator>
{
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) protected readonly calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.MerkleTreeDescription) protected readonly treeDescription: MerkleTreeDescription,
      private readonly traversalOptions: TopoOrderOptions
   )
   { }

   protected abstract get terminalDepth(): number;
   protected abstract get subtreeReach(): number;
   protected abstract get rootReach(): number;
   protected abstract get usedLeafCount(): number;

   protected abstract getLayers(): IterableIterator<LayerFor<Node>>;
   protected abstract getNodesOnLayer(layer: LayerFor<Node>, leftToRight: boolean): IterableIterator<Node>;

   public* [Symbol.iterator](): IterableIterator<Node>
   {
      const layerIter = this.getLayers();
      const rootNodeGenerators: IterableIterator<Node>[] =
         [...layerIter].map((layer: LayerFor<Node>) =>
            this.getNodesOnLayer(layer, this.traversalOptions.leftToRight)
         );

      const rootIter = rootNodeGenerators[0];
      if (this.terminalDepth > 1) {
         for (let ii = 0; ii < this.rootReach; ii++) {
            yield* this.orderBlocksFromDepth(1, rootNodeGenerators);
         }
      } else if (this.terminalDepth === 1) {
         yield* this.orderBlocksFromLeaf(
            1, rootNodeGenerators[this.terminalDepth]);
      }

      yield rootIter.next().value
   }

   private* orderBlocksFromDepth(
      depth: number, rootNodeGenerators: IterableIterator<Node>[]
   ): IterableIterator<Node>
   {
      const myLayer = rootNodeGenerators[depth];
      let nextRootNode: IteratorResult<Node>;
      const nextDepth = depth + 1;
      const reach = this.subtreeReach;

      if (this.terminalDepth > nextDepth) {
         for (let ii = 0; ii < reach; ii++) {
            yield* this.orderBlocksFromDepth(nextDepth, rootNodeGenerators);
         }
      } else {
         yield* this.orderBlocksFromLeaf(
            nextDepth, rootNodeGenerators[this.terminalDepth]);
      }

      nextRootNode = myLayer.next();
      if(this.mayYield(nextDepth, nextRootNode)) {
         yield nextRootNode.value;
      }
   }

   private* orderBlocksFromLeaf(
      depth: number, myLayer: IterableIterator<Node>
   ): IterableIterator<Node>
   {
      for (let ii = 0; ii < this.subtreeReach; ii++) {
         const nextResultNode = myLayer.next();

         if(this.mayYield(depth, nextResultNode)) {
            yield nextResultNode.value;
         }
      }
   }

   private mayYield(depth: number, nextResult: IteratorResult<Node>): boolean
   {
      // This implies the tree is corrupt, so throw.  The other condition is an expected termination.
      if (nextResult.done) {
         throw Error(`Out of values at depth: ${depth}`);
      }

      // TODO: Consider an option to restrict visit used nodes only instead of full capacity.
      return (
         (! this.traversalOptions.onlyVisitUsed) ||
         (nextResult.value.index < this.usedLeafCount)
      );
   }
}