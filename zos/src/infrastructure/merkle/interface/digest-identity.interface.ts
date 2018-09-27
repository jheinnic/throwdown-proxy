import {BlockMappedDigestLocator, MerkleDigestLocator} from '../locator';

export interface IDigestIdentityService {
   findAbsolutePathsToLeafNodes(leftToRight?: boolean): IterableIterator<string>;

   getLocalNameFromBlock(digestBlock: BlockMappedDigestLocator): string

   getLocalNameFromLeafDigest(leafDigest: MerkleDigestLocator): string;

   getAbsolutePathToBlock(digestBlock: BlockMappedDigestLocator): string

   getAbsoluteBlockPathToLeafDigest(leafDigest: MerkleDigestLocator): string;

   getBlockByAbsolutePathName(absoluteName: string): BlockMappedDigestLocator

   getLeafDigestByAbsolutePathName(absoluteName: string): MerkleDigestLocator;
}