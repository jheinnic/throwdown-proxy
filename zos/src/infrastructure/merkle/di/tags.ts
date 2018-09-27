import {SymbolEnum} from '../../lib';

type MerkleTagKeys = 'LRUCacheType';

export const MERKLE_TAG_KEYS: SymbolEnum<MerkleTagKeys> = {
   LRUCacheType: Symbol.for('LRUCache.Type')
};

type MerkleCacheTypes = 'Digest' | 'Series' | 'Subtree' | 'BlockMap';

export const MERKLE_CACHE_TYPES: SymbolEnum<MerkleCacheTypes> = {
   Digest: Symbol.for('Digest'),
   Identity: Symbol.for('Identity')
};
