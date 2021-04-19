import {
   NGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN, NGramModuleType, TRIGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN
} from './ngrams.constants';
import { NgramAlphabetMapper } from './components';
import { DynamicProviderBindingStyle, IAsClass } from '@jchptf/nestjs';

export const TRIGRAM_ALPHABET_MAPPER_PROVIDER: IAsClass<NgramAlphabetMapper, NGramModuleType> = {
   style: DynamicProviderBindingStyle.CLASS,
   provide: TRIGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN,
   useClass: NgramAlphabetMapper,
};

export const NGRAM_ALPHABET_MAPPER_PROVIDER: IAsClass<NgramAlphabetMapper, NGramModuleType> = {
   style: DynamicProviderBindingStyle.CLASS,
   provide: NGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN,
   useClass: NgramAlphabetMapper,
};

export const NGRAM_PROVIDERS =
   [TRIGRAM_ALPHABET_MAPPER_PROVIDER, NGRAM_ALPHABET_MAPPER_PROVIDER];
