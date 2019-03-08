import { ISAAC_GENERATOR_FACTORY_PROVIDER_TOKEN } from './isaac.constants';
import { IsaacPseudoRandomSourceFactory } from '../../../../infrastructure/randomize/sources';

export const ISAAC_GENERATOR_FACTORY_PROVIDER = {
   provide: ISAAC_GENERATOR_FACTORY_PROVIDER_TOKEN,
   useClass: IsaacPseudoRandomSourceFactory
}