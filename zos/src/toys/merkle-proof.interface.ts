import {LeafLocatorInterface} from '../locator/leaf-locator';
import {MerkleProofStep} from './merkle-proof-step.interface';

export interface MerkleProof
{
   /**
    * Locator for the subject of the proof (which is not stored here because the caller presumably has it
    * already.
    */
   readonly subjectLocator?: LeafLocatorInterface;

   /**
    * Sequence of hashes that start with the subject leaf's sibling and end with the last hash before
    * the merkle tree's root.
    */
   readonly ancestorSiblingPath: ReadonlyArray<MerkleProofStep>;

   /**
    * Root hash of the merkle tree.  Every proof taken from the same tree will yield the same value here,
    * presuming the tree is not modified between any two proof extractions.
    */
   readonly merkleRoot: Buffer;

}