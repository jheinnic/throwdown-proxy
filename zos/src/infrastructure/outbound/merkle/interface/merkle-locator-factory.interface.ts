import {
   BlockMappedDigestLocator, BlockMappedLayerLocator, MerkleDigestLocator, MerkleLayerLocator
} from '../locator/index';

export interface IMerkleLocatorFactory {
   findDigestByPosition(position: number): MerkleDigestLocator;

   findDigestByLayerAndIndex(layer: MerkleLayerLocator, index: number): MerkleDigestLocator;

   findDigestByRecordAddress(recordAddress: number): MerkleDigestLocator;

   findLayerByDepth(depth: number): MerkleLayerLocator;

   findBlockMappedDigestByOffset(offset: number): BlockMappedDigestLocator;

   findBlockMappedDigestByLayerAndIndex(layer: BlockMappedLayerLocator, index: number): BlockMappedDigestLocator

   findBlockMappedLayerByLevel(level: number): BlockMappedLayerLocator;
}