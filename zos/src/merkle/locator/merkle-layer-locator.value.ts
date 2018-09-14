export class MerkleLayerLocator
{
   /**
    * Zero-based index for locating left-most node of a referenced series in its layer.
    *
    * Indices for each layer range from 0 to ((2^depth) - 1) where depth is 0 at tree's root, and
    * N at each of its (2^N) leaves.
    */
   public readonly width: number;

   /**
    * A zero-based index for locating a layer's left-most node based on an absolute ordering of
    * nodes within and between layers.
    *
    * @see MerkleDigestLocator.position
    */
   public readonly leftPosition: number;

   /**
    * A zero-based index for locating a layer's right-most node based on an absolute ordering of
    * nodes within and between layers.
    *
    * @see MerkleDigestLocator.position
    */
   public readonly rightPosition: number;

   /**
    * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
    * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
    * a layer depth equal to the height (or depth) of the tree in which they are located, at
    * layer indices ranging from 0 to ((2^depth) - 1).
    */
   public constructor(public readonly depth: number)
   {
      this.width = Math.pow(2, depth);
      this.leftPosition = this.width - 1;
      this.rightPosition = this.leftPosition * 2;
   }

   // public get treeDepth(): number {
   //    return this.treeDescription.treeDepth;
   // }
}