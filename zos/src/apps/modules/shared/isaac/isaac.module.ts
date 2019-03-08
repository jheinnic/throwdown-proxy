import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ISAAC_GENERATOR_FACTORY_PROVIDER } from './isaac-generator-factory.provider';
import {
   AsyncModuleParam, asyncProviderFromParam, DynamicProviderToken, ModuleIdentifier
} from '@jchptf/nestjs';
import { ISAAC_SEED_BUFFER_PROVIDER_TOKEN } from './isaac.constants';
import { getDynamicIsaacGeneratorProviderToken } from './isaac.utilities';
import {
   IPseudoRandomSource, IPseudoRandomSourceFactory
} from '../../../../infrastructure/randomize/interface';
@Module({
   imports: [],
   controllers: [],
   providers: [ISAAC_GENERATOR_FACTORY_PROVIDER],
   exports: [ISAAC_GENERATOR_FACTORY_PROVIDER]
})
export class IsaacModule
{
   public static forGeneratorFeature(
      module: ModuleIdentifier,
      seedBuffer: AsyncModuleParam<Buffer>,
      tag?: string): DynamicModule
   {
      const bufferProvider: Provider[] =
         asyncProviderFromParam(ISAAC_SEED_BUFFER_PROVIDER_TOKEN, seedBuffer);

      const sourceProviderToken: DynamicProviderToken<IPseudoRandomSource> =
         getDynamicIsaacGeneratorProviderToken(module, tag);
      const sourceProvider = {
         provide: sourceProviderToken,
         useFactory: (
            generatorFactory: IPseudoRandomSourceFactory<Buffer>,
            seedSource: Buffer
         ) => {
            return generatorFactory.seedGenerator(seedSource);
         },
         inject: [ISAAC_GENERATOR_FACTORY_PROVIDER, ISAAC_SEED_BUFFER_PROVIDER_TOKEN]
      };

      return {
         module: IsaacModule,
         providers: [...bufferProvider, sourceProvider]
      };
   }

   // For Future TODO
   // forSequenceFeature(_module: ModuleIdentifier) { }
}
