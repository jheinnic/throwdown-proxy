import {TicketArtworkLocator, KeyPairLocator} from '../locators/index';

/**
 * Every ticket in a pool under construction has a placeholder node in a conceptual merkle
 * tree with a block-mapped subtree storage overlay.  Placeholder nodes are always on the
 * deepest leaf layer.  The merkle tree maps to a block storage overlay tree, where each
 * path from root to leaf travels through path of subtrees, which correspond to directory
 * nodes when locating leaf-associated-content in a hierarchical storage medium (e.g.
 * filesystem).  A breadth-first enumeration of subtrees also provides offsets into block storage
 * for efficient merkle proof transactions.
 *
 * This services assists primarily with the former hierarchical translations.
 */
export interface ITicketPoolStagingArea {
   /**
    * Returns an iterator that returns an abstraction encapsulating block-mapped subtrees of the
    * ticket pool's logical merkle tree's block and directory overlay.  The first time an instance
    * of this iterator is walked through, it also drives iteration through all necessary side effects
    * to create the abstraction's mapped directory structure in the underlying storage medium.  This
    * abstraction hides details about what that storage infrastructure's implementation actually is.
    * It may be local filesystem, in-memory buffers, HashiCorp Vault, Redis, or any other storage
    * facility which exposes document records as leaf nodes in a directed acyclic tree of named
    * directories.
    *
    * @param leftToRight
    */
   // findAllDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<Directories>;

   // findLeafDirectories(leftToRight?: boolean): IterableIterator<Directories>;

   findAllKeyPairs(leftToRight?: boolean): IterableIterator<KeyPairLocator>;

   findAllArtwork(renderStyle: string): IterableIterator<TicketArtworkLocator>;

   findArtwork(renderStyle: string, sourceKeys: Iterable<KeyPairLocator>): IterableIterator<TicketArtworkLocator>;

   /*
   TODO
   getDigestLocator(slotLocator: TicketSlotLocator): MerkleDigestLocator;

   getBlockDirectory(digestBlock: BlockMappedDigestLocator): Directory

   getDigestKeyPair(leafDigest: MerkleDigestLocator): KeyPairLocator

   getDigestArtwork(renderStyle: string, leafDigest: MerkleDigestLocator): ArtworkLocator
   */
}