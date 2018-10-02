import {BlockMappedDigestLocator, MerkleDigestLocator} from '../locator';
import {NamedPath} from './named-path.value';

export interface ICanonicalPathNaming {
   findAllBlocksPathNamesDepthFirst(leftToRight?: boolean):
      IterableIterator<NamedPath<BlockMappedDigestLocator>>;

   findLeafBlockPathName(leftToRight?: boolean):
      IterableIterator<NamedPath<BlockMappedDigestLocator>>;

   findLeafDigestPathNames(leftToRight?: boolean):
      IterableIterator<NamedPath<MerkleDigestLocator>>;

   getBlockNamePart(digestBlock: BlockMappedDigestLocator): string

   getLeafDigestNamePart(leafDigest: MerkleDigestLocator): string

   getBlockPathName(digestBlock: BlockMappedDigestLocator): NamedPath<BlockMappedDigestLocator>

   getLeafDigestPathName(leafDigest: MerkleDigestLocator): NamedPath<MerkleDigestLocator>;

   // getBlockByAbsolutePathName(absoluteName: string): BlockMappedDigestLocator

   // getLeafDigestByAbsolutePathName(absoluteName: string): MerkleDigestLocator;
}