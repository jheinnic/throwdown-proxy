import {SymbolEnum} from '../../di';

type MerkleTypeNames = 'LRUCache' | 'MerkleCalculator' | 'DigestStorageStrategy' | 'PreImageStorageStrategy' | 'BlockCacheStrategy' |
   'MerkleTreeEngine' | 'MerkleTreeSyncTask' | 'MerkleTreeSwapTask' | 'MerkleTreeInsertTask' | 'MerkleTreeUpdateTask' |
   'MerkleTreeProofTask' | 'MerkleTree' | 'MerkleTreeDescription';

export const MERKLE_TYPES: SymbolEnum<MerkleTypeNames> = {
   LRUCache: Symbol.for('LRUCache'),
   MerkleCalculator: Symbol.for('MerkleCalculator'),
   DigestStorageStrategy: Symbol.for('DigestStorageStrategy'),
   PreImageStorageStrategy: Symbol.for('PreImageStorageStrategy'),
   BlockCacheStrategy: Symbol.for('BlockCacheStrategy'),
   MerkleTreeEngine: Symbol.for('MerkleTreeEngine'),
   MerkleTreeSyncTask: Symbol.for('MerkleTreeSyncTask'),
   MerkleTreeSwapTask: Symbol.for('MerkleTreeSwapTask'),
   MerkleTreeInsertTask: Symbol.for('MerkleTreeInsertTask'),
   MerkleTreeUpdateTask: Symbol.for('MerkleTreeUpdateTask'),
   MerkleTreeProofTask: Symbol.for('MerkleTreeProofTask'),
   MerkleTree: Symbol.for('MerkleTree'),
   MerkleTreeDescription: Symbol.for('MerkleTreeDescription')
}