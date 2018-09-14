import {inject, injectable, tagged} from 'inversify';
import * as LRU from 'lru-cache';
import {IMerkleLocatorFactory} from './interface';
import {MerkleDigestLocator, MerkleLayerLocator, MerkleTreeDescription} from './locator';
import {MERKLE_CACHE_TYPES, MERKLE_TAG_KEYS, MERKLE_TYPES} from './di';

@injectable()
export class MerkleLocatorFactory implements IMerkleLocatorFactory
{
   private readonly layerCache: MerkleLayerLocator[];

   constructor(
      @inject(MERKLE_TYPES.MerkleTreeDescription)
      private readonly treeDescription: MerkleTreeDescription,
      @inject(MERKLE_TYPES.LRUCache)
      @tagged(MERKLE_TAG_KEYS.LRUCacheType, MERKLE_CACHE_TYPES.Digest)
      private readonly digestCache: LRU.Cache<number, MerkleDigestLocator>)
   {
      this.layerCache = new Array<MerkleLayerLocator>(treeDescription.treeDepth);

      for (let ii=0; ii<treeDescription.treeDepth; ii++) {
         this.layerCache[ii] = new MerkleLayerLocator(ii);
      }
   }

   findDigestByLayerIndex(layer: MerkleLayerLocator, digestIndex: number): MerkleDigestLocator {
      const position = layer.leftPosition + digestIndex;
      let retVal: MerkleDigestLocator|undefined = this.digestCache.get(position);
      if (! retVal) {
         retVal = new MerkleDigestLocator(this.treeDescription, layer, digestIndex);
         this.digestCache.set(position, retVal);
      }

      return retVal;
   }

   findDigestByRecordAddress(address: number): MerkleDigestLocator
   {
      return this.getDigestByPosition(address + this.treeDescription.recordToDigestOffset);
   }

   findDigestByPosition(position: number): MerkleDigestLocator
   {
      return this.getDigestByPosition(position);
   }

   findLayerByDepth(depth: number): MerkleLayerLocator
   {
      return this.layerCache[depth];
   }
   private getDigestByPosition(position: number): MerkleDigestLocator
   {
      let retVal: MerkleDigestLocator|undefined = this.digestCache.get(position);
      if (! retVal) {
         const layerIndex = Math.floor(
            Math.log2(position + 1)
         );

         const layer = this.layerCache[layerIndex];
         const digestIndex = position - layer.leftPosition;
         retVal = new MerkleDigestLocator(this.treeDescription, layer, digestIndex);
         this.digestCache.set(position, retVal);
      }

      return retVal;
   }
}