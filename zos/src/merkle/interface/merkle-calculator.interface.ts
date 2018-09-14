import {MonoTypeOperatorFunction, Observable, OperatorFunction} from 'rxjs';
import {MerkleLayerLocator} from '../locator/merkle-layer-locator.interface';
import {MerkleSeriesLocator} from '../locator/merkle-series-locator.interface';
import {BlockMappedSubtreeLocator} from '../locator/block-mapped-subtree-locator.interface';
import {MerkleDigestLocator} from '../locator/merkle-digest-locator.interface';
import {MerkleProofLocator} from '../locator/merkle-proof-locator.interface';

export interface IMerkleCalculator {
   /**
    * Given a Merkle Tree layer index, return the storage layer it can be found in.
    *
    * TODO: This needs a better signature
    */
   mapDepthToStorageLevel(merkleDepth: number): Observable<MerkleLayerLocator>;

   /**
    * Given a storage layer index, return the merkle tree layer that maps to it as root.
   mapStorageLevelToRootDepth(storageLevel: number): Observable<MerkleLayerLocator>;
    */

   /**
    * Given a storage layer index, return the merkle tree layer at the base of its
    * slice of Merkle subtrees.
   mapStorageLevelToLeafDepth(storageLevel: number): Observable<MerkleLayerLocator>;
    */

   recordAddressToLocator(recordAddress: number): Observable<MerkleDigestLocator>;

   digestPositionToLocator(digestPosition: number): Observable<MerkleDigestLocator>;

   depthAndIndexToLocator(depth: number, index: number): Observable<MerkleDigestLocator>;

   getSiblingLocator(): MonoTypeOperatorFunction<MerkleDigestLocator>;

   getMerkleProofLocator(): OperatorFunction<MerkleDigestLocator, MerkleProofLocator>;

   // getMerkleProofLocator(recordAddress: number): Observable<MerkleProofLocator>;

   getMerkleLayerLocators(): Observable<MerkleLayerLocator>;

   // getMerkleDigestLocatorsByLayer(layerLocator: MerkleLayerLocator): Observable<MerkleDigestLocator>;
   getMerkleDigestLocatorsByLayer(): OperatorFunction<MerkleLayerLocator, MerkleDigestLocator>;

   // getMerkleDigestRunLocators(layerLocator: MerkleLayerLocator, runLength: number): Observable<MerkleSeriesLocator>;
   getMerkleDigestRunLocators(runLength: number): OperatorFunction<MerkleLayerLocator, MerkleSeriesLocator>;

   getBlockMappedMerkleLayerLocators(): Observable<MerkleLayerLocator>;

   getTreeAssemblyBlockOrder(): Observable<BlockMappedSubtreeLocator>;
}