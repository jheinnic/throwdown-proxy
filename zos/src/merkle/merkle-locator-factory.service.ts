import {inject, injectable} from 'inversify';
import {MERKLE_TYPES} from '../di';
import * as LRU from 'lru-cache';
import {MerkleDigestLocator} from './merkle-digest-locator.value';
import {MerkleTreeDescription} from '../merkle-tree-description.class';
import {MerkleLayerLocator} from './merkle-layer-locator.interface';

@injectable()
export class LocatorFactory
{
   private readonly layerCache: MerkleLayerLocator[];

   constructor(
      @inject(MERKLE_TYPES.MerkleTreeDescription) @tagged(private readonly treeDescription: MerkleTreeDescription,
      @inject(MERKLE_TYPES.LRUCache) private readonly digestCache: LRU.Cache<number, MerkleDigestLocator>)
   {
      this.layerCache = new Array<MerkleLayerLocator>(treeDescription.treeDepth);

      for (let ii=0; ii<treeDescription.treeDepth; ii++) {
         this.layerCache[ii] = new MerkleLayerLocator(treeDescription, ii);
      }
   }

   findDigestByLayerIndex(layer: MerkleLayerLocator, index: number): MerkleDigestLocator {
      return this.findDigestByPosition(layer.leftPosition + index);
   }

   findDigestByRecordAddress(address: number): MerkleDigestLocator {
      return this.getDigestByPosition(address + this.treeDescription.recordToDigestOffset);
   }

   findDigestByPosition(position: number): MerkleDigestLocator
   {
   }

   private getDigestByDigestPosition(position: number): MerkleDigestLocator
   {
      let retVal: MerkleDigestLocator = this.digestCache.get(position);
      if (! retVal) {
         retVal = new MerkleDigestLocator()
      }
   }

   private getLayerByDigestPosition(position: number): MerkleLayerLocator
   {
      const layerIndex = Math.floor(
         Math.log2(position + 1)
      );
      this.layerCache[layerIndex];

   private getDigestByDigestPositionAndLayer
}