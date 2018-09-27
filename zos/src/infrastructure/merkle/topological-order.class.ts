import {inject} from 'inversify';

import {BlockMappedDigestLocator, BlockMappedLayerLocator, MerkleTreeDescription} from './locator';
import {IMerkleCalculator} from '../merkle';
import {BfsOrderOptions} from './interface';
import {MERKLE_TYPES} from './di';
import '../../infrastructure/reflection';

export class TopologicalOrder
{
   // private readonly rootNodeGenerators: ReadonlyArray<Iterator<BlockMappedDigestLocator>>;
   private readonly rootReach: number;

   private readonly subtreeReach: number;

   private readonly terminalDepth: number;

   private readonly leafCount: number;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.MerkleTreeDescription) treeDescription: MerkleTreeDescription,
      private readonly traversalOptions: BfsOrderOptions
   )
   {
      // rootReach will be 0 if the tree has only one level.
      this.rootReach = treeDescription.rootSubtreeReach;
      this.subtreeReach = treeDescription.subtreeReach;
      this.terminalDepth = treeDescription.treeDepth - 1;
      this.leafCount = treeDescription.leafCount;
   }

   public* [Symbol.iterator](): IterableIterator<BlockMappedDigestLocator>
   {
      const rootLayerIter = this.calculator.getBlockMappedLayers();
      const rootNodeGenerators: IterableIterator<BlockMappedDigestLocator>[] =
         [...rootLayerIter].map((layer: BlockMappedLayerLocator) =>
            this.calculator.getSubtreesOnBlockMappedLayer(layer)
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
      depth: number, rootNodeGenerators: IterableIterator<BlockMappedDigestLocator>[]
   ): IterableIterator<BlockMappedDigestLocator>
   {
      const myLayer = rootNodeGenerators[depth];
      let nextRootNode: IteratorResult<BlockMappedDigestLocator>;
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
      depth: number, myLayer: IterableIterator<BlockMappedDigestLocator>
   ): IterableIterator<BlockMappedDigestLocator>
   {
      for (let ii = 0; ii < this.subtreeReach; ii++) {
         const nextResultNode = myLayer.next();

         if(this.mayYield(depth, nextResultNode)) {
            yield nextResultNode.value;
         }
      }
   }

   private mayYield(depth: number, nextResult: IteratorResult<BlockMappedDigestLocator>): boolean
   {
      if (nextResult.done) {
         // This implies the tree is corrupt, so throw.  The other condition is an expected
         // termination.
         throw Error(`Out of values at depth: ${depth}`);
      }

      // TODO: Add filter on leafCount too!
      return (
         (
            !this.traversalOptions.startFrom || (
            this.traversalOptions.startFrom.index <= nextResult.value.index
            )
         ) &&
         (
            !this.traversalOptions.endWith || (
            this.traversalOptions.endWith.index >= nextResult.value.index
            )
         )
      );
   }
}