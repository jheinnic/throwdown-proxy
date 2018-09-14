import {MerkleOrientationType} from '../merkle-orientation-type.enum';
import {BlockMappedSubtreeLocator} from './block-mapped-subtree-locator.interface';
import {MerkleDigestLocator} from './merkle-digest-locator.interface';
import {LeafLocatorInterface} from './leaf-locator.interface';

export interface MerkleProofLocator {
   /**
    * Leaf locator for the subject of identified proof.
    */
   readonly subjectLeaf: LeafLocatorInterface;

   /**
    * Block locators for every block required to retrieve a hash from each ancestor node's sibling.
    */
   readonly siblingAncestorBlocks: BlockMappedSubtreeLocator[];

   /**
    * Sequential path of nodes from the blocks referenced by {@see siblingAncestorBlocks}.  Begins with
    * the sibling of {@link subjectLeaf}, and ends with the locator for the Merkle tree root.
    */
   // readonly siblingAncestorNodes: LogicalNodeLocator[];
   readonly siblingAncestorPath: MerkleDigestLocator[];

   readonly pathFromRoot: ReadonlyArray<MerkleOrientationType>;
}