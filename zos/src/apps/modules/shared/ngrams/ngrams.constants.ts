import { NgramAlphabetMapper, TrigramAlphabetMapper } from './components';
import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';

export const NGRAM_MODULE = Symbol('@jchptf/trigrams');
export type NGRAM_MODULE = typeof NGRAM_MODULE;

export const TRIGRAM_ALPHABET_MAPPER = 'TrigramAlphabetMapper';
export const NGRAM_ALPHABET_MAPPER = 'NGramAlphabetMapper';

export class NGramModuleId {
   public static readonly [MODULE_ID] = NGRAM_MODULE;

   [TRIGRAM_ALPHABET_MAPPER]: TrigramAlphabetMapper;
   [NGRAM_ALPHABET_MAPPER]: NgramAlphabetMapper;
}

export type NGramModuleType = typeof NGramModuleId;

function blessLocal<Token extends keyof NGramModuleId>(token: Token):
   LocalProviderToken<NGramModuleId[Token], NGramModuleType, Token>
{
   return blessLocalProviderToken(token, NGramModuleId);
}

export const TRIGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN = blessLocal(TRIGRAM_ALPHABET_MAPPER);
export const NGRAM_ALPHABET_MAPPER_PROVIDER_TOKEN = blessLocal(NGRAM_ALPHABET_MAPPER);
