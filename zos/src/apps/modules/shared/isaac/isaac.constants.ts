import { IPseudoRandomSourceFactory, IPseudoRandomSource } from '../../../../infrastructure/randomize/interface';
import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';

export const ISAAC_MODULE = Symbol('@jchptf/isaac');
export type ISAAC_MODULE = typeof ISAAC_MODULE;

export const ISAAC_GENERATOR_FACTORY = Symbol('IsaacGeneratorFactory');
export const ISAAC_GENERATOR = Symbol('IsaacSource');
export const ISAAC_SEED_BUFFER = Symbol('Buffer');

export class IsaacModuleId {
   public static readonly [MODULE_ID] = ISAAC_MODULE;

   [ISAAC_GENERATOR_FACTORY]: IPseudoRandomSourceFactory<Buffer>;
   [ISAAC_SEED_BUFFER]: Buffer;
   [ISAAC_GENERATOR]: IPseudoRandomSource;
}

export type IsaacModuleType = typeof IsaacModuleId;

function blessLocal<Token extends keyof IsaacModuleId>(token: Token):
   LocalProviderToken<IsaacModuleId[Token], IsaacModuleType, Token>
{
   return blessLocalProviderToken(token, IsaacModuleId);
}

export const ISAAC_GENERATOR_FACTORY_PROVIDER_TOKEN = blessLocal(ISAAC_GENERATOR_FACTORY);
export const ISAAC_SEED_BUFFER_PROVIDER_TOKEN = blessLocal(ISAAC_SEED_BUFFER);
export const ISAAC_GENERATOR_PROVIDER_TOKEN = blessLocal(ISAAC_GENERATOR);

// export const ISAAC_SEEDED_GENERATOR_DYNAMIC_MODULE_KIND =
   // getDynamicModuleType(ISAAC_MODULE, "SeededGenerator");

// export const ISAAC_PRNG_SEQUENCE_DYNAMIC_MODULE_KIND =
//    getDynamicModuleType(ISAAC_MODULE, "PRNGSequence");