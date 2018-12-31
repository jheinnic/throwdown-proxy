import {BlockMappedDigestLocator, MerkleDigestLocator} from '../locator';
import {NamedPath} from './named-path.interface';

export interface ICanonicalPathNaming {
   findAllBlocksPathNamesDepthFirst(namespaceRoot: string, leftToRight?: boolean):
      IterableIterator<NamedPath<BlockMappedDigestLocator>>;

   findLeafBlockPathNames(namespaceRoot: string, leftToRight?: boolean):
      IterableIterator<NamedPath<BlockMappedDigestLocator>>;

   findLeafDigestPathNames(namespaceRoot: string, leftToRight?: boolean, digestSuffix?: string):
      IterableIterator<NamedPath<MerkleDigestLocator>>;

   // getBlockNamePart(digestBlock: BlockMappedDigestLocator): string

   // getLeafDigestNamePart(leafDigest: MerkleDigestLocator): string

   getBlockPathName(namespaceRoot: string, digestBlock: BlockMappedDigestLocator): NamedPath<BlockMappedDigestLocator>

   getLeafDigestPathName(namespaceRoot: string, leafDigest: MerkleDigestLocator, digestSuffix?: string): NamedPath<MerkleDigestLocator>;

   // getBlockByAbsolutePathName(absoluteName: string): BlockMappedDigestLocator

   // getLeafDigestByAbsolutePathName(absoluteName: string): MerkleDigestLocator;
}