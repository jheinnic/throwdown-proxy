export class MerkleTreeDescription {
   public readonly treeDepth: number;
   public readonly tierCount: number;
   public readonly recordToDigestOffset: number;

   public readonly subtreeDepth: number;
   public readonly subtreeWidth: number;
   public readonly subtreeReach: number;

   public readonly rootSubtreeDepth: number;
   public readonly rootSubtreeWidth: number;
   public readonly rootSubtreeReach: number;

   public readonly blockMappedRootLayers: ReadonlyArray<number>;
   public readonly blockMappedLeafLayers: ReadonlyArray<number>;

   public readonly leafBlockCapacity: number;
   public readonly leafBlocksInUse: number;

   public constructor(
      public readonly bitsPerPreImage: number,
      public readonly bitsPerDigest: number,
      public readonly bitsPerIOp: number,
      public readonly leafCapacity: number,
      public readonly leavesInUse: number)
   {
      if (bitsPerDigest > bitsPerIOp) {
         throw Error(
            `Bits per digest, ${bitsPerDigest}, must not exceed bits per I/O, ${bitsPerIOp}`);
      }
      if (leafCapacity < leavesInUse) {
         throw new Error(`Leaf use, ${leavesInUse}, may not exceed allocated capacity, ${leafCapacity}`)
      }

      this.treeDepth = Math.ceil( Math.log2(leafCapacity) ) + 1;
      this.leafCapacity = Math.pow(2, this.treeDepth - 1);
      this.recordToDigestOffset = Math.pow(2, this.treeDepth - 1) - 1;

      this.subtreeDepth = Math.floor(
         Math.log2(bitsPerIOp / bitsPerDigest)
      );
      this.subtreeReach = Math.pow(2, this.subtreeDepth);
      this.subtreeWidth = this.subtreeReach / 2;

      this.tierCount = Math.ceil(this.treeDepth / this.subtreeDepth);

      // Reduce the root subtree depth enough that the subtrees for every remaining tier
      // can have maximum depth and accommodate the entire remaining tree.  Maximum tree
      // depth in the formula below is the depth a tree would be if the subtrees at every
      // layer (including the root layer) were at maximum depth.
      //
      // RootSubtreeDepth = DesiredTreeDepth - MaximumTreeDepth + NonRootSubtreeDepth
      this.rootSubtreeDepth = this.treeDepth - (
         this.tierCount * this.subtreeDepth
      ) + this.subtreeDepth;
      this.rootSubtreeReach = Math.pow(2, this.rootSubtreeDepth);
      this.rootSubtreeWidth = this.rootSubtreeReach / 2;

      const blockRatio = (this.tierCount > 1)
         ? Math.pow(2, this.subtreeDepth - 1)
         : Math.pow(2, this.rootSubtreeDepth - 1);

      this.leafBlockCapacity = this.leafCapacity / blockRatio;
      this.leafBlocksInUse = Math.ceil( this.leavesInUse / blockRatio );

      let nextSubtreeIndex = 1;
      let layerIndex = this.rootSubtreeDepth;
      const blockMappedRoots = new Array(this.tierCount);
      const blockMappedLeaves = new Array(this.tierCount);

      blockMappedRoots[0] = 0;
      blockMappedLeaves[0] = layerIndex - 1;
      while (layerIndex < this.treeDepth) {
         blockMappedRoots[nextSubtreeIndex] = layerIndex;
         layerIndex += this.subtreeDepth;
         blockMappedLeaves[nextSubtreeIndex++] = layerIndex - 1;
      }

      this.blockMappedRootLayers = blockMappedRoots;
      this.blockMappedLeafLayers = blockMappedLeaves;
   }
}