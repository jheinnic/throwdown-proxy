import {LogicalSubtreeLocator} from './logical-subtree-locator.value';
import {MerkleTreeDescription} from './merkle-tree-description.value';
import {MerkleLayerLocator} from './merkle-layer-locator.value';

/**
 * Specialized subclass of LogicalSubtreeLocator that is suitable only for subtrees aligned with a
 * storage block boundary.  For any stored Merkle Tree, there is a subset of its logical layers where
 * the series of node values for each node in the logical maps to the first few bytes from each of a
 * series of consecutive storage blocks.  The remaining content of such blocks stores the rest of the
 * subtree between those nodes and the roots of the next block-aligned subtrees.
 *
 * Instances of this interface are used to identify the range of content found in storage system blocks,
 * and also to provide a mapping between their physical and logical offsets.
 */
export class BlockMappedSubtreeLocator
{
   /**
    * Zero-based address of a block given an absolute ordering beginning with the root, then
    * proceeding through each block of each successive layer without resetting the addresses to
    * zero at each descent from one layer to next below.
    */
   public readonly offset: number;

   /**
    * Zero-based index of a block's height relative to the storage tree's root.
    */
   public readonly level: number;

   /**
    * Zero-based index of a block relative to the first block at the same height.
    */
   // readonly levelIndex: number;

   public constructor(
      treeDescription: MerkleTreeDescription, public readonly merkleSubtree: LogicalSubtreeLocator)
   {
      const rootDepth = merkleSubtree.rootDepth;

      if (rootDepth >= treeDescription.rootSubtreeDepth) {
         let iterDepth = rootDepth - treeDescription.rootSubtreeDepth;
         let storeLevel = 1;
         let offset = 1;
         let previousReach = treeDescription.rootSubtreeReach;
         let previousFan = 1;

         while (iterDepth > 0) {
            storeLevel += 1;
            offset += previousReach * previousFan;
            previousFan *= previousReach;
            previousReach = treeDescription.subtreeReach;
            iterDepth -= treeDescription.subtreeDepth;
         }

         if (iterDepth < 0) {
            throw new Error(`${rootDepth} is not a block mapped subtree depth layer`);
         }

         this.level = storeLevel;
         this.offset = offset + merkleSubtree.rootIndex;
      } else if (rootDepth > 0) {
         throw new Error(`${rootDepth} is not a block mapped subtree depth layer`);
      } else {
         this.level = 0;
         this.offset = 0;
      }
   }

   // public get treeDescription(): MerkleTreeDescription
   // {
   //    return this.merkleSubtree.treeDescription;
   // }

   public get levelIndex(): number
   {
      return this.merkleSubtree.rootIndex;
   }

   public get rootLayer(): MerkleLayerLocator
   {
      return this.merkleSubtree.rootLayer;
   }
}
