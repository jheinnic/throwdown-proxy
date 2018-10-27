import Optional from 'typescript-optional';
import {BlockMappedLayerLocator} from './block-mapped-layer-locator.value';

export class MerkleLayerLocator
{
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


   public constructor(public readonly depth: number, public readonly size: number)
   {
      this.leftPosition = size - 1;
      this.rightPosition = this.leftPosition * 2;
   }

   public get blockMapped(): boolean{
      return false;
   }

   public asBlockMapped(): Optional<BlockMappedLayerLocator> {
      return Optional.empty();
   }
}