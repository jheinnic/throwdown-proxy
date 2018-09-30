import {MerkleOrientationType} from './merkle-orientation-type.enum';
import {MerkleNodeType} from './merkle-node-type.enum';
import {MerkleLayerLocator} from './merkle-layer-locator.value';
import {BlockMappedDigestLocator} from './block-mapped-digest-locator.value';
import Optional from 'typescript-optional';

export class MerkleDigestLocator
{
   public readonly leafLayerDepth: number;

   /**
    * A zero-based index for locating a node within its layer.  The indices for each layer range
    * from 0 to ((2^depth) - 1) where depth is the 0-based index for tree depth layers, with the
    * root at depth=0.  For a tree of depth N, all its 2^N leaves are at depth layer N.
    */
   constructor(
      public readonly layer: MerkleLayerLocator,
      public readonly index: number,
      private readonly treeDepth: number)
   {
      if (index < 0) {
         throw new Error('Node index may not be negative');
      }
      if (index >= layer.size) {
         throw new Error('Node index cannot exceed layer size, ' + layer.size);
      }
      this.leafLayerDepth = this.treeDepth - 1;
   }

  /**
    * A zero-based index for locating a node's layer.  The root node is at depth 0, and its
    * and its immediate children are all at depth 1.  All leaf nodes are found at a layer depth
    * equal to the tree's overall height minus one.
    */
   public get depth(): number
   {
      return this.layer.depth;
   }

   /**
    * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
    * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
    * a layer depth equal to the height (or depth) of the tree in which they are located, at
    * layer indices ranging from 0 to ((2^depth) - 1).
    */
   public get position(): number
   {
      return this.layer.leftPosition + this.index;
   }

   public get orientation(): MerkleOrientationType
   {
      return ((this.index % 2) == 0)
         ? (this.depth > 0)
            ? MerkleOrientationType.LEFT_CHILD
            : MerkleOrientationType.ROOT
         : MerkleOrientationType.RIGHT_CHILD;
   }

   /**
    * A zero-based index for locating a node based on an absolute ordering of nodes both within
    * and between layers.  For this case, the root has an address of zero, and its two immediate
    * children have addresses of 1 and 2, and their children occupy addresses 3 through 6.
    *
    * For any layer N, the node address of its earliest resident node is always ((2^N) - 1), and
    * the node address of its last resident node is always ((2^(N+1)) - 2).  This correlates well
    * with the rule that dictates any tree of depth N will always have ((2^(N+1)) - 1) nodes, with
    * (2^N) leaves and ((2^N) - 1) internal nodes.
    *
    * Note that the math above works out because node counts are one-based, whereas addresses are
    * zero-based, hence ((2^(N+1) - 2) is the address for the ((2^(N+1) - 1)th node.
    */
   public get nodeType(): MerkleNodeType
   {
      if (this.depth == 0) {
         return MerkleNodeType.ROOT;
      }

      if (this.depth < this.leafLayerDepth) {
         return MerkleNodeType.INTERNAL;
      }

      return MerkleNodeType.LEAF;
   }

   public get siblingIndex(): number|undefined
   {
      return ((this.index % 2) == 0)
         ? (this.depth > 0)
            ? this.index + 1
            : undefined
         : this.index - 1;
   }

   public get siblingPosition(): number|undefined
   {
      return ((this.index % 2) == 0)
         ? (this.depth > 0)
            ? this.position + 1
            : undefined
         : this.position - 1;
   }

   public get leftMostPosition(): number {
      return (Math.pow(2, this.leafLayerDepth) - 1)
         + (this.index * Math.pow(2, this.leafLayerDepth - this.depth))
   }

   public get rightMostPosition(): number {
      return (Math.pow(2, this.leafLayerDepth) - 1)
         + ((this.index + 1) * Math.pow(2, this.leafLayerDepth - this.depth))
         - 1;
   }

   public get blockMapped(): boolean {
      return false;
   }

   public asBlockMapped(): Optional<BlockMappedDigestLocator> {
      return Optional.empty();
   }
}