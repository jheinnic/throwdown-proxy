/**
    * Every leaf hash in a Merkle Tree was mapped from a pre-image block from a sequence of pre-image
    * data blocks.  Because the Merkle tree stores a tree of internal hash nodes as well, the index for
    * a pre-image and its initial hash in the Merkle tree will rarely be the same.
    *
    * There is some offset within the Merkle tree file after which all remaining content comes from hashed
    * data blocks.  The relative distance from that point to the hash representing a given data block is
    * the same as the distance from the beginning of the data block sequence to the data block itself,
    * when both are measured in terms of record count.  Data blocks and hash blocks are not necessarily
    * the same size, so the distance in bytes may differ, but the difference will have the same ratio
    * as the ratio between the raw block sizes.
    *
    * To spare the end user from needing to understand the implementation details, the tree calculator
    * provides instances of this value interface on request to provide a convenient mapping between both
    * locations where a given data block is represented in a prepared Merkle data set.
    */
import {MerkleOrientationType} from './merkle-orientation-type.enum';

export interface LeafLocatorInterface
{
   /**
    * Index of target record pre-image in source data series.
    */
   readonly sourceAddress: number;

   /**
    * Index of target record as a hash in Merkle tree.
    */
   readonly digestPosition: number;

   readonly orientation: MerkleOrientationType;
}
