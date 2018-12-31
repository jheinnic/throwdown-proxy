import {MerkleLayerLocator} from './merkle-layer-locator.value';
import {MerkleOrientationType} from './merkle-orientation-type.enum';
import {BlockMappedDigestLocator} from './block-mapped-digest-locator.value';

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
   public readonly width: number;

   public readonly leftLeafPosition: number;

   public readonly rightLeafPosition: number;

   public constructor(
      public readonly root: BlockMappedDigestLocator,
      public readonly leafLayer: MerkleLayerLocator,
      public readonly leftLeafSpan: number,
      public readonly rightLeafSpan: number)
   {
      if (rightLeafSpan < leftLeafSpan) {
         throw new Error('Right span cannot be to the left of left span');
      }

      if (leftLeafSpan < 0) {
         throw new Error('Left span cannot be negative');
      }

      if (leafLayer.depth < root.depth) {
         throw new Error('Leaf layer cannot be above the root node');
      }

      this.width = rightLeafSpan + 1 - leftLeafSpan;
      if (this.width > leafLayer.size) {
         throw new Error('Left span and right span width cannot exceed ' + leafLayer.size);
      }

      this.leftLeafPosition = this.leafLayer.leftPosition + this.leftLeafSpan;
      this.rightLeafPosition = this.leafLayer.leftPosition + this.rightLeafSpan;
   }

   /**
    * Zero-based address of a block given an absolute ordering beginning with the root, then
    * proceeding through each block of each successive layer without resetting the addresses to
    * zero at each descent from one layer to next below.
    */
   public get offset(): number {
      return this.root.blockOffset;
   }

   /**
    * Zero-based index of a block's height relative to the storage tree's root.  Level is measured
    * in units per subtree, regardless of how many Merkle layers each subtree spans.
    */
   public get level(): number {
      return this.root.blockLevel;
   }

   /**
    * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
    * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
    * a layer depth equal to the height (or depth) of the tree in which they are located, at
    * layer indices ranging from 0 to ((2^depth) - 1).
    */
   public get rootDepth(): number {
      return this.root.depth;
   }

   public get leafDepth(): number {
      return this.leafLayer.depth;
   }

   public get orientation(): MerkleOrientationType {
      return this.root.orientation;
   }

   /**
    * Zero-based index of a block relative to the first block at the same height.
    */
   public get rootIndex(): number
   {
      return this.root.index;
   }

   /**
    * Zero-based index of a digest relative to all digests in the tree numbered from root
    * to leaf layers, and left to right within each layer.
    *
    * Easily confused with "offset", since it assigns an absolute order to every block
    * mapped digest as well as the blocks they map to, but its is different insofar as
    * position values also enumerate the non-mapped inner digests, whereas offset only
    * counts the blocks, for which there is only one root per block.
    */
   public get rootPosition(): number
   {
      return this.root.position;
   }

   // public get leftPosition(): number {
   //    return this.leafLayer.leftPosition + this.leftSpan;
   // }

   /**
    * Zero-based index for locating right-most node of a referenced series in its host tree.
    *
    * Whereas rightSpan is an index among nodes on the same layer, rightPosition is an index
    * into all the nodes across all layers.
    */
   // public get rightPosition(): number {
   //    return this.leafLayer.leftPosition + this.rightSpan;
   // }
}
