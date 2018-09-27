import Optional from 'typescript-optional';
import {
   BlockMappedDigestLocator, BlockMappedLayerLocator, MerkleDigestLocator, MerkleLayerLocator,
   MerkleProofLocator
} from '../locator/index';
import {Director} from '../../lib/index';
import {IDfsOrderBuilder} from './dfs-order-builder.interface';
import {IBfsOrderBuilder} from './bfs-order-builder.interface';

export interface IMerkleCalculator {
   readonly tierCount: number;

   readonly treeDepth: number;

   getLayers(topDown?: boolean): IterableIterator<MerkleLayerLocator>;

   getBlockMappedLayers(topDown?: boolean): IterableIterator<BlockMappedLayerLocator>

   getDigestsOnLeafLayer(leftToRight?: boolean): IterableIterator<MerkleDigestLocator>

   getDigestsOnLayer(fromLayer: MerkleLayerLocator, leftToRight?: boolean): IterableIterator<MerkleDigestLocator>;

   getChildDigests(fromParent: BlockMappedDigestLocator, leftToRight?: boolean): IterableIterator<MerkleDigestLocator>

   getSubtreesOnBlockMappedLayer(fromLevel: BlockMappedLayerLocator, leftToRight?: boolean): IterableIterator<BlockMappedDigestLocator>;

   getDigestPathToRoot(leafBlock: MerkleDigestLocator): IterableIterator<MerkleDigestLocator>

   getChildBlockMappedRoots(fromParent: BlockMappedDigestLocator, leftToRight?: boolean): IterableIterator<BlockMappedDigestLocator>

   getBlockMappedPathToRoot(leafBlock: MerkleDigestLocator): IterableIterator<BlockMappedDigestLocator>

   getBlockMappedPathFromRoot(leafBlock: MerkleDigestLocator): IterableIterator<BlockMappedDigestLocator>

   getDigestsInBlockSubtree(subtreeBlock: BlockMappedDigestLocator, topDown?: boolean, leftToRight?: boolean): IterableIterator<MerkleDigestLocator>

   getTopoBlockOrder(director: Director<IBfsOrderBuilder>): Iterable<BlockMappedDigestLocator>;

   // getBfsBlockOrder(topToBottom?: boolean, leftToRight?: boolean): Iterable<BlockMappedDigestLocator>;

   getDfsBlockOrder(director: Director<IDfsOrderBuilder>): Iterable<BlockMappedDigestLocator>;

   findLayerByDepth(depth: number): MerkleLayerLocator;

   findLeafLayer(): MerkleLayerLocator;

   findParentLayer(fromLayer: MerkleLayerLocator): MerkleLayerLocator|undefined;

   findBlockMappedLayerByLevel(level: number): BlockMappedLayerLocator;

   findLeafBlockMappedLayer(): BlockMappedLayerLocator;

   findParentBlockMappedLayer(fromLayer: BlockMappedLayerLocator): Optional<MerkleLayerLocator>;

   /**
    * Given a Merkle Tree layer index, return the layer where the roots of the logical subtrees used
    * to map its digests to storage blocks are located.
    */
   findNearestBlockMappedLayer(fromLayer: MerkleLayerLocator): BlockMappedLayerLocator;

   findDigestByRecordAddress(recordAddress: number): MerkleDigestLocator;

   findDigestByPosition(digestPosition: number): MerkleDigestLocator;

   findDigestByLayerAndIndex(layer: MerkleLayerLocator, digestIndex: number): MerkleDigestLocator;

   findParentDigest(mapToParent: MerkleDigestLocator): MerkleDigestLocator | undefined;

   findSiblingDigest(mapToSibling: MerkleDigestLocator): MerkleDigestLocator | undefined;

   findFurthestDescendant(fromDigest: MerkleDigestLocator, leftMost?: boolean): MerkleDigestLocator

   findBlockMappedRootByOffset(offset: number): BlockMappedDigestLocator;

   findParentBlockMappedRoot(fromChild: BlockMappedDigestLocator): Optional<BlockMappedDigestLocator>

   findNearestBlockMappedRoot(fromDigest: MerkleDigestLocator): BlockMappedDigestLocator;

   findMerkleProofForDigest(mapToProof: MerkleDigestLocator): MerkleProofLocator;
}