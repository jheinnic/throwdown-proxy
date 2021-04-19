import { Module } from '@nestjs/common';
import { NGRAM_PROVIDERS } from './ngrams.providers';

@Module({
   imports: [],
   controllers: [],
   providers: NGRAM_PROVIDERS,
   exports: NGRAM_PROVIDERS
})
export class NgramsModule
{ }

