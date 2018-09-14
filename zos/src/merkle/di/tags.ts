import {SymbolEnum} from '../../di';

type MerkleTagKeys = 'LRUCacheType';

export const MERKLE_TAG_KEYS: SymbolEnum<MerkleTagKeys> = {
   LRUCacheType: Symbol.for('LRUCache.Type')
};

type MerkleCacheTypes = 'Digest' | 'Series';

export const MERKLE_CACHE_TYPES: SymbolEnum<MerkleCacheTypes> = {
   Digest: Symbol.for('Digest'),
   Series: Symbol.for('Series')
};
