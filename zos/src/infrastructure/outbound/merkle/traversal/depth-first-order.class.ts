import {inject} from 'inversify';
import {BlockMappedDigestLocator, MerkleTreeDescription} from '../locator/index';

import {DepthFirstVisitMode, IMerkleCalculator} from '../index';
import {MERKLE_TYPES} from '../di/index';
import {DfsOrderOptions} from '../interface/index';

export class DepthFirstOrder
{
   private readonly maxLevel: number;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.MerkleTreeDescription) treeDescription: MerkleTreeDescription,
      private readonly orderOptions: DfsOrderOptions)
   {
      this.maxLevel = (!! orderOptions.endWith)
         ? orderOptions.endWith.level
         : treeDescription.tierCount - 1;
   }

   public* [Symbol.iterator](): IterableIterator<BlockMappedDigestLocator>
   {
      const rootBlock = this.calculator.findBlockMappedRootByOffset(0);
      switch (this.orderOptions.visitMode) {
         case DepthFirstVisitMode.PRE_ORDER: {
            yield* this.doPreOrderDfs(rootBlock);
            break;
         }
         case DepthFirstVisitMode.IN_ORDER: {
            yield* this.doInOrderDfs(rootBlock);
            break;
         }
         case DepthFirstVisitMode.POST_ORDER: {
            yield* this.doPostOrderDfs(rootBlock);
            break;
         }
      }
   }

   public* doPreOrderDfs(parent: BlockMappedDigestLocator): IterableIterator<BlockMappedDigestLocator> {
      yield parent;

      if (parent.blockLevel < this.maxLevel) {
         for (let child of this.calculator.getChildBlockMappedRoots(parent, this.orderOptions.leftToRight)) {
            yield* this.doPreOrderDfs(child);
         }
      }
   }


   public* doInOrderDfs(parent: BlockMappedDigestLocator): IterableIterator<BlockMappedDigestLocator> {
      if (parent.blockLevel < this.maxLevel) {
         const childIter = this.calculator.getChildBlockMappedRoots(parent, this.orderOptions.leftToRight);
         const firstChild = childIter.next();
         if (!firstChild.done) {
            yield* this.doInOrderDfs(firstChild.value);
         }
         for (let nextChild of childIter) {
            yield parent;
            yield* this.doInOrderDfs(nextChild);
         }
      } else {
         yield parent;
      }
   }


   public* doPostOrderDfs(parent: BlockMappedDigestLocator): IterableIterator<BlockMappedDigestLocator> {
      if (parent.blockLevel < this.maxLevel) {
         for (let child of this.calculator.getChildBlockMappedRoots(parent, this.orderOptions.leftToRight)) {
            yield* this.doPostOrderDfs(child);
         }
      }

      yield parent;
   }

   // private mayYield(level: number, nextResult: IteratorResult<BlockMappedDigestLocator>): boolean
   // {
   //    if (nextResult.done) {
   //       // This implies the tree is corrupt, so throw.  The other condition is an expected
   //       // termination.
   //       throw Error(`Out of values at level: ${level}`);
   //    }
   //
   //    // TODO: Add filter on leafCapacity too!
   //    return (
   //       (
   //          !this.traversalOptions.startFrom || (
   //          this.traversalOptions.startFrom.index <= nextResult.value.index
   //          )
   //       ) &&
   //       (
   //          !this.traversalOptions.endWith || (
   //          this.traversalOptions.endWith.index >= nextResult.value.index
   //          )
   //       )
   //    );
   // }
}