import { DynamicProviderToken, getDynamicProviderToken, ModuleIdentifier } from '@jchptf/nestjs';
import { IPseudoRandomSource } from '../../../../infrastructure/randomize/interface';
import { ISAAC_DYNAMIC_GENERATOR_PROVIDER_BINDING, ISAAC_GENERATOR_TYPE } from './isaac.constants';

export function getDynamicIsaacGeneratorProviderToken(
   moduleId: ModuleIdentifier, tag?: string
): DynamicProviderToken<IPseudoRandomSource>
{
   return getDynamicProviderToken(
      moduleId, ISAAC_DYNAMIC_GENERATOR_PROVIDER_BINDING, ISAAC_GENERATOR_TYPE, tag);
}