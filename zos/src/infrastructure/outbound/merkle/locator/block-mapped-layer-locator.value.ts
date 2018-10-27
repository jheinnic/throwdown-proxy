import {MerkleLayerLocator} from './merkle-layer-locator.value';
import Optional from 'typescript-optional';

export class BlockMappedLayerLocator extends MerkleLayerLocator
{
   /**
    * In addition to the layer descriptive properties
    *
    * @see MerkleLayerLocator
    * @param rootDepth Digest layer depth as defined by MerkleLayerLocator
    * @param size Maximum number of digests at this levels' root Merkle Layer as per MerkleLayerLocator
    * @param level Zero-based index of the physical block tier across all block levels of a given
    * Merkle tree's physical storage mapping.
    * @param leafLayer MerkleLayerLocator where subtrees from this layer's mapped physical storage
    * level get their leaf-most MerkleDigestLocators.
    * @param blockHeight The number of MerkleLayerLocator depths encapsulated by this
    * BlockMappedLevelLocator.  Generally this is the same value for all BlockMappedLevelLocator's except
    * at level=0.
    * @param blockWidth The number of MerkleDigestLocators in each of this Level's
    * BlockMappedSubtreeLocators at their leaf (lowest) MerkleLayerLocator.
    * @param blockReach The number of BlockMappedDigestLocator children to the left and right of each
    * of its leaf digests.  Generally, twice the width except at the blocks of the lowest tree level.
    * @param leftOffset Zero-based index of left-most BlockMappedDigestLocator's blockIndex from
    * this layer across entire tree, numbered left to right within levels, starting at root level,
    * then proceeding downward to lower levels.
    * @param rightOffset Zero-based index of right-most BlockMappedDigestLocator's blockIndex from
    * this layer across entire tree, numbered left to right within levels, starting at root level,
    * then proceeding downward to lower levels.
    */
   public constructor(
      public readonly level: number, public readonly size: number,
      public readonly rootDepth: number, public readonly leafLayer: MerkleLayerLocator,
      public readonly blockHeight: number, public readonly blockWidth: number, public readonly blockReach: number,
      public readonly leftOffset: number, public readonly rightOffset: number)
   {
      super(rootDepth, size);
   }

   public get blockMapped(): boolean
   {
      return true;
   }

   public asBlockMapped(): Optional<BlockMappedLayerLocator>
   {
      return Optional.of(this);
   }
}