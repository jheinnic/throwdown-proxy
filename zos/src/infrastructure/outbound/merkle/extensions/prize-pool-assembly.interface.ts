import {BlockMappedDigestLocator, MerkleDigestLocator} from '../locator';
import {NamedPath} from '../interface/named-path.interface';

export interface ICanonicalPathNaming {
   findAllBlocksPathNamesDepthFirst(leftToRight?: boolean):
      IterableIterator<NamedPath<BlockMappedDigestLocator>>;

   findLeafBlockPathName(leftToRight?: boolean):
      IterableIterator<NamedPath<BlockMappedDigestLocator>>;

   findLeafDigestPathNames(leftToRight?: boolean):
      IterableIterator<NamedPath<MerkleDigestLocator>>;

   getBlockPathName(digestBlock: BlockMappedDigestLocator): NamedPath<BlockMappedDigestLocator>

   getLeafDigestPathName(leafDigest: MerkleDigestLocator): NamedPath<MerkleDigestLocator>;
}