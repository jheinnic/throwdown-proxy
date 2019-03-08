import {
   getLocalProviderToken, getModuleIdentifier, getNamedSubtypeIntent,
} from '@jchptf/api';
import { IAlphabetMapper } from './interfaces';
import { NgramAlphabetMapper, TrigramAlphabetMapper } from './components';

export const TRIGRAMS_MODULE = getModuleIdentifier('@jchptf/trigrams');

// export const ALPHABET_MAPPER_TYPE =
//    getNamedTypeIntent<IAlphabetMapper>('AlphabetMapper');

export const TRIGRAM_ALPHABET_MAPPER_TYPE =
   getNamedSubtypeIntent<IAlphabetMapper, TrigramAlphabetMapper>('TrigramAlphabetMapper');

export const NGRAM_ALPHABET_MAPPER_TYPE =
   getNamedSubtypeIntent<IAlphabetMapper, NgramAlphabetMapper>('NgramAlphabetMapper');

export const TRIGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN =
   getLocalProviderToken(TRIGRAMS_MODULE, TRIGRAM_ALPHABET_MAPPER_TYPE);

export const NGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN =
   getLocalProviderToken(TRIGRAMS_MODULE, TRIGRAM_ALPHABET_MAPPER_TYPE);
