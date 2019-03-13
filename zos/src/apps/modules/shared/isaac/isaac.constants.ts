import {
   getDynamicModuleType,
   getGlobalProviderToken, getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent
} from '@jchptf/nestjs';
import { IPseudoRandomSourceFactory, IPseudoRandomSource } from '../../../../infrastructure/randomize/interface';

export const ISAAC_MODULE = getModuleIdentifier('@jchptf/isaac');

export const ISAAC_GENERATOR_FACTORY_TYPE =
   getNamedTypeIntent<IPseudoRandomSourceFactory<Buffer>>('IsaacGeneratorFactory');

export const ISAAC_GENERATOR_TYPE =
   getNamedTypeIntent<IPseudoRandomSource>('IsaacSource');

export const ISAAC_BUFFER_TYPE =
   getNamedTypeIntent<Buffer>('Buffer');

export const ISAAC_GENERATOR_FACTORY_PROVIDER_TOKEN =
   getGlobalProviderToken<IPseudoRandomSourceFactory<Buffer>>(ISAAC_GENERATOR_FACTORY_TYPE);

export const ISAAC_SEED_BUFFER_PROVIDER_TOKEN =
   getLocalProviderToken(ISAAC_MODULE, ISAAC_BUFFER_TYPE);

export const ISAAC_SEEDED_GENERATOR_DYNAMIC_MODULE_KIND =
   getDynamicModuleType(ISAAC_MODULE, "SeededGenerator");

export const ISAAC_PRNG_SEQUENCE_DYNAMIC_MODULE_KIND =
   getDynamicModuleType(ISAAC_MODULE, "PRNGSequence");