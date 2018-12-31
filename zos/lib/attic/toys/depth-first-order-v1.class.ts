import {
   BlockMappedDigestLocator, BlockMappedLayerLocator, MerkleTreeDescription
} from '../infrastructure/merkle/locator/index';
import {inject} from 'inversify';

import {DepthFirstVisitMode, IMerkleCalculator} from '../infrastructure/merkle/index';
import {MERKLE_TYPES} from '../infrastructure/merkle/di/index';
import {DfsOrderOptions} from '../infrastructure/merkle/interface/index';

export class DepthFirstOrderV1
{
   private readonly maxLevel: number;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.MerkleTreeDescription) treeDescription: MerkleTreeDescription,
      private readonly orderOptions: DfsOrderOptions)
   {
      this.maxLevel = (!! orderOptions.endWith)
         ? orderOptions.endWith.level + 1
         : treeDescription.tierCount;
   }

   public* [Symbol.iterator](): IterableIterator<BlockMappedDigestLocator>
   {
      const latestDigests: BlockMappedDigestLocator[] =
         new Array<BlockMappedDigestLocator>(this.maxLevel);
      const preOrderStack: number[] = [];
      const inOrderStack: number[] = [];
      const postOrderStack: number[] = [];

      const rootLayerIter = this.calculator.getBlockMappedLayers();
      const digestGenerators: IterableIterator<BlockMappedDigestLocator>[] =
         [...rootLayerIter].map((layer: BlockMappedLayerLocator) =>
            this.calculator.getSubtreesOnBlockMappedLayer(layer, this.orderOptions.leftToRight)
         );

      for( let ii=0; ii < this.maxLevel; ii++ )
      {
         preOrderStack.push(ii);
      }
      let currentLevel = 0;
      let nextDigest: IteratorResult<BlockMappedDigestLocator>;
      while ((preOrderStack.length > 0)
         || (inOrderStack.length > 0)
         || (postOrderStack.length > 0))
      {
         if (currentLevel >= this.maxLevel) {
            throw new Error(`Preorder traversal requires a level lower than ${this.maxLevel}, not ${currentLevel}`);
         }
         nextDigest = digestGenerators[currentLevel].next();
         if (nextDigest.done) {
            throw new Error('Premature iteration end on layer ' + currentLevel);
         }

         console.log('Preorder visit on ' + currentLevel);
         latestDigests[currentLevel++] = nextDigest.value;

         if (currentLevel < this.maxLevel) {
            inOrderStack.push(currentLevel);
            if (this.orderOptions.visitMode === DepthFirstVisitMode.PRE_ORDER) {
               yield nextDigest.value;
            }
            console.log(inOrderStack);
         } else {
            // All modes trigger on leaf nodes--no if check required!
            yield nextDigest.value;

            currentLevel -= postOrderStack.length;
            if (this.orderOptions.visitMode === DepthFirstVisitMode.POST_ORDER) {
               while (postOrderStack.length > 0) {
                  yield latestDigests[postOrderStack.pop()!];
               }
            }

            if (inOrderStack.length > 0) {
               const nextInOrder = inOrderStack.pop()!;
               postOrderStack.push(nextInOrder);
               if (this.orderOptions.visitMode === DepthFirstVisitMode.IN_ORDER) {
                  yield latestDigests[nextInOrder];
               }
               console.log(`In order at ${nextInOrder}, ${latestDigests[nextInOrder]}`);

               currentLevel = nextInOrder + 1;
            }
         }
      }
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