import {MerkleOrientationType} from './merkle-orientation-type.enum';
import {MerkleNodeType} from './merkle-node-type.enum';
import {MerkleLayerLocator} from './merkle-layer-locator.value';
import {MerkleTreeDescription} from './merkle-tree-description.value';

export class MerkleDigestLocator
{
   /**
    * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
    * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
    * a layer depth equal to the height (or depth) of the tree in which they are located, at
    * layer indices ranging from 0 to ((2^depth) - 1).
    */
   public readonly depth: number;

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
   public readonly position: number;

   public readonly nodeType: MerkleNodeType;

   /**
    * A zero-based index for locating a node within its layer.  The indices for each layer range
    * from 0 to ((2^depth) - 1) where depth is the 0-based index for tree depth layers, with the
    * root at depth=0.  For a tree of depth N, all its 2^N leaves are at depth layer N.
    */
   constructor(
      treeDescription: MerkleTreeDescription,
      layer: MerkleLayerLocator,
      public readonly index: number)
   {
      if (index < 0) {
         throw new Error('Node index may not be negative');
      }
      if (index >= layer.width) {
         throw new Error('Node index cannot exceed layer width, ' + layer.width);
      }

      this.depth = layer.depth;
      this.position = layer.leftPosition + index;

      if (layer.depth > 0) {
         if (layer.depth < treeDescription.treeDepth) {
            this.nodeType = MerkleNodeType.INTERNAL;
         } else {
            this.nodeType = MerkleNodeType.LEAF;
         }
      } else {
         this.nodeType = MerkleNodeType.ROOT;
      }
   }

   // public get treeDescription()
   // {
   //    return this.layer.treeDescription;
   // }

   public get orientation(): MerkleOrientationType
   {
      return (
         (this.index % 2) == 0)
         ? (this.depth > 0)
            ? MerkleOrientationType.LEFT_CHILD
            : MerkleOrientationType.ROOT
         : MerkleOrientationType.RIGHT_CHILD;
   }
}