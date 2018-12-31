import {MonoTypeOperatorFunction, Observable, OperatorFunction} from 'rxjs';
import {MerkleLayerLocator} from '../../infrastructure/merkle/locator/merkle-layer-locator.value';
import {MerkleSeriesLocator} from '../locator/merkle-series-locator.value';
import {BlockMappedSubtreeLocator} from '../../infrastructure/merkle/locator/block-mapped-subtree-locator.value';
import {MerkleDigestLocator} from '../../infrastructure/merkle/locator/merkle-digest-locator.value';
import {MerkleProofLocator} from '../../infrastructure/merkle/locator/merkle-proof-locator.interface';

export interface IMerkleCalculator {
   getLayerLocators(): Observable<MerkleLayerLocator>;

   getBlockMappedRootLayerLocators(): Observable<MerkleLayerLocator>;

   getBlockMappedLeafLayerLocators(): Observable<MerkleLayerLocator>;

   getTreeAssemblyBlockOrder(): Observable<BlockMappedSubtreeLocator>;

   /**
    * Given a Merkle Tree layer index, return the storage layer it can be found in.
    */
   mapDepthToStorageLevel(): MonoTypeOperatorFunction<MerkleLayerLocator>;

   /**
    * Given a storage layer index, return the merkle tree layer that maps to it as root.
   mapStorageLevelToRootDepth(storageLevel: number): Observable<MerkleLayerLocator>;
    */

   /**
    * Given a storage layer index, return the merkle tree layer at the base of its
    * slice of Merkle subtrees.
   mapStorageLevelToLeafDepth(storageLevel: number): Observable<MerkleLayerLocator>;
    */

   mapRecordAddressToDigestLocator(): OperatorFunction<number, MerkleDigestLocator>;

   mapPositionToDigestLocator(): OperatorFunction<number, MerkleDigestLocator>;

   mapLayerAndIndexToDigestLocator(): OperatorFunction<[MerkleLayerLocator, number], MerkleDigestLocator>;

   mapDigestLocatorToSibling(): MonoTypeOperatorFunction<MerkleDigestLocator>;

   mapLayerToDigestLocators(): OperatorFunction<MerkleLayerLocator, Observable<MerkleDigestLocator>>;

   mapLayerToSeriesLocators(runLength: number): OperatorFunction<MerkleLayerLocator, Observable<MerkleSeriesLocator>>;

   mapDigestToMerkleProofLocator(): OperatorFunction<MerkleDigestLocator, MerkleProofLocator>;
}