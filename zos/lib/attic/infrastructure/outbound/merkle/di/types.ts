import {SymbolEnum} from '../../lib';

type MerkleTypeNames =
   'LRUCache'
   | 'LRUCacheType'
   | 'DigestIdentityService'
   | 'MerkleCalculator'
   | 'MerkleLocatorFactory'
   | 'BlockTopologyWalk'
   | 'DigestStorageStrategy'
   | 'DigestIdentityService'
   | 'PreImageStorageStrategy'
   | 'MerkleTreeDescription'
   | 'CanonicalNamingService';

export const MERKLE_TYPES: SymbolEnum<MerkleTypeNames> = {
   LRUCache: Symbol.for('LRUCache'),
   LRUCacheType: Symbol.for('LRUCache.Type'),
   MerkleCalculator: Symbol.for('MerkleCalculator'),
   MerkleLocatorFactory: Symbol.for('MerkleLocatorFactory'),
   DigestStorageStrategy: Symbol.for('DigestStorageStrategy'),
   PreImageStorageStrategy: Symbol.for('PreImageStorageStrategy'),
   DigestIdentityService: Symbol.for('DigestIdentityService'),
   BlockTopologyWalk: Symbol.for('BlockTopologyWalk'),
   // MerkleTreeSyncTask: Symbol.for('MerkleTreeSyncTask'),
   // MerkleTreeSwapTask: Symbol.for('MerkleTreeSwapTask'),
   // MerkleTreeInsertTask: Symbol.for('MerkleTreeInsertTask'),
   // MerkleTreeUpdateTask: Symbol.for('MerkleTreeUpdateTask'),
   // MerkleTreeProofTask: Symbol.for('MerkleTreeProofTask'),
   // MerkleTree: Symbol.for('MerkleTree'),
   MerkleTreeDescription: Symbol.for('MerkleTreeDescription'),
   CanonicalNamingService: Symbol.for('CanonicalNamingService')
};

export type MerkleInstallerNames = 'MerkleTreeModuleInstaller';

export const MERKLE_DI_TYPES: SymbolEnum<MerkleInstallerNames> = {
   MerkleTreeModuleInstaller: Symbol.for('MerkleTreeModuleInstaller')
};