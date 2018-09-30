import {BlockMappedDigestLocator, MerkleDigestLocator} from '../locator';
import {NamedElement} from './named-element.value';

export interface IDigestIdentityService {
   findBlocksDepthFirstWithAbsolutePath(leftToRight?: boolean):
      IterableIterator<NamedElement<BlockMappedDigestLocator>>;

   findLeafBlocksWithAbsolutePath(leftToRight?: boolean):
      IterableIterator<NamedElement<BlockMappedDigestLocator>>;

   findLeafDigestsWithAbsolutePath(leftToRight?: boolean):
      IterableIterator<NamedElement<MerkleDigestLocator>>;

   getLocalNameFromBlock(digestBlock: BlockMappedDigestLocator): string

   getLocalNameFromLeafDigest(leafDigest: MerkleDigestLocator): string;

   getAbsolutePathToBlock(digestBlock: BlockMappedDigestLocator): string

   getAbsoluteBlockPathToLeafDigest(leafDigest: MerkleDigestLocator): string;

   getBlockByAbsolutePathName(absoluteName: string): BlockMappedDigestLocator

   getLeafDigestByAbsolutePathName(absoluteName: string): MerkleDigestLocator;
}