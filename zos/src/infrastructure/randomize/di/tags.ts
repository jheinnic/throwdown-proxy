import {SymbolEnum} from '@jchptf/api';

type RecordListTags = 'PRNGAlgorithm' | 'EntropyOrigin';

export const RANDOMIZE_TAGS: SymbolEnum<RecordListTags> = {
   PRNGAlgorithm: Symbol.for('BackingStorage'),
   EntropyOrigin: Symbol.for('RecordSetCurator')
};

type AlgorithmKinds = 'ISAAC' | 'HMAC-DRBG' | 'NodeCrypto'

export const PRNG_ALGORITHM_KINDS: SymbolEnum<AlgorithmKinds> = {
   ISAAC: Symbol.for('ISAAC'),
   'HMAC-DRBG': Symbol.for('HMAC-DRBG'),
   NodeCrypto: Symbol.for('NodeCrypto')
};

type EntropySourceKinds =
   'RandomOrg'
   | 'Hardware'
   | 'NativeOS'
   | 'LocalFixture'
   | 'SharedFixture'
   | 'FakeDev'

export const ENTROPY_SOURCE_KINDS: SymbolEnum<EntropySourceKinds> = {
   RandomOrg: Symbol.for('RandomOrg'),
   Hardware: Symbol.for('Hardware'),
   NativeOS: Symbol.for('NativeOS'),
   LocalFixture: Symbol.for('LocalFixture'),
   SharedFixture: Symbol.for('SharedFixture'),
   FakeDev: Symbol.for('FakeDev')
};
