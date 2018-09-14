import {MerkleDigestLocator} from '../locator/merkle-digest-locator.value';
import {MerkleLayerLocator} from '../locator/merkle-layer-locator.interface';

export interface IMerkleLocator {
   findDigestByPosition(position: number): MerkleDigestLocator;

   findDigestByLayerIndex(layer: MerkleLayerLocator, index: number): MerkleDigestLocator;

   findDigestByRecordAddress(recordAddress: number): MerkleDigestLocator;

   findLayerByIndex(index: number): MerkleLayerLocator;
}