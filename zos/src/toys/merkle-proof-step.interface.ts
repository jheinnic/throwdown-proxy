import {MerkleOrientationType} from '../merkle/locator/merkle-orientation-type.enum';

export interface MerkleProofStep {
   readonly digest: Buffer;
   readonly depth: number;
   readonly orientation: MerkleOrientationType;
}