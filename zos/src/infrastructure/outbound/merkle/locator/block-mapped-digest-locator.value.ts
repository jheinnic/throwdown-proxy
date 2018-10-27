import {MerkleDigestLocator} from './merkle-digest-locator.value';
import {BlockMappedLayerLocator} from './block-mapped-layer-locator.value';
import {MerkleLayerLocator} from './merkle-layer-locator.value';
import Optional from 'typescript-optional';

export class BlockMappedDigestLocator extends MerkleDigestLocator
{
   /**
    * A zero-based index for locating a node within its layer.  The indices for each layer range
    * from 0 to ((2^depth) - 1) where depth is the 0-based index for tree depth layers, with the
    * root at depth=0.  For a tree of depth N, all its 2^N leaves are at depth layer N.
    */
   constructor(
      public readonly rootLayer: BlockMappedLayerLocator,
      public readonly index: number,
      treeDepth: number)
   {
      super(rootLayer, index, treeDepth);
   }

   public get blockOffset(): number {
      return this.rootLayer.leftOffset + this.index;
   }

   public get blockLevel(): number {
      return this.rootLayer.level;
   }

   public get blockHeight(): number {
      return this.rootLayer.blockHeight;
   }

   public get blockWidth(): number {
      return this.rootLayer.blockWidth;
   }

   public get blockReach(): number {
      return this.rootLayer.blockReach;
   }

   public get rootDepth(): number {
      return this.depth;
   }

   public get leafDepth(): number {
      return this.leafLayer.depth;
   }

   public get leafLayer(): MerkleLayerLocator {
      return this.rootLayer.leafLayer;
   }

   public get leftLeafSpan(): number {
      return this.index * this.blockWidth;
   }

   public get rightLeafSpan(): number {
      return this.leftLeafSpan + this.blockWidth - 1;
   }

   public get leftLeafPosition(): number {
      return this.leafLayer.leftPosition + this.leftLeafSpan;
   }

   public get rightLeafPosition(): number {
      return this.leafLayer.leftPosition + this.rightLeafSpan;
   }

   public get blockMapped(): boolean {
      return true;
   }

   public asBlockMapped(): Optional<BlockMappedDigestLocator> {
      return Optional.of(this);
   }
}