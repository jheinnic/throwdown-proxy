import {MerkleDigestLocator, MerkleLayerLocator} from '../locator';

export interface IMerkleLocatorFactory {
   findDigestByPosition(position: number): MerkleDigestLocator;

   findDigestByLayerIndex(layer: MerkleLayerLocator, index: number): MerkleDigestLocator;

   findDigestByRecordAddress(recordAddress: number): MerkleDigestLocator;

   findLayerByDepth(index: number): MerkleLayerLocator;
}