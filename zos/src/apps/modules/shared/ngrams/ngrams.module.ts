import { Module } from '@nestjs/common';
import {
   NGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN, TRIGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN
} from './ngrams.constants';
import { NgramAlphabetMapper, TrigramAlphabetMapper } from './components';

const NGRAM_PROVIDERS = [
   {
      provide: NGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN,
      useClass: NgramAlphabetMapper
   },
   {
      provide: TRIGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN,
      useClass: TrigramAlphabetMapper
   },
];

@Module({
   imports: [],
   controllers: [],
   providers: NGRAM_PROVIDERS,
   exports: NGRAM_PROVIDERS
})
export class NgramsModule
{ }

