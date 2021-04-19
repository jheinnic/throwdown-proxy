import { DynamicModule, Module } from '@nestjs/common';
import { buildDynamicModule, IDynamicModuleBuilder, IModule } from '@jchptf/nestjs';

import { ISAAC_GENERATOR_FACTORY_PROVIDER } from './isaac-generator-factory.provider';
import {
   ISAAC_GENERATOR, ISAAC_GENERATOR_PROVIDER_TOKEN, ISAAC_SEED_BUFFER,
   IsaacModuleId, IsaacModuleType
} from './isaac.constants';
import { IsaacGeneratorFeatureOptions } from './isaac-generator-feature-options.type';

@Module({
   imports: [],
   controllers: [],
   providers: [ISAAC_GENERATOR_FACTORY_PROVIDER],
   exports: [ISAAC_GENERATOR_FACTORY_PROVIDER]
})
export class IsaacModule extends IsaacModuleId
{
   public static forGeneratorFeature<Consumer extends IModule>(
      options: IsaacGeneratorFeatureOptions<Consumer>): DynamicModule
   {
      return buildDynamicModule(
         IsaacModule,
         options.forModule,
         (builder: IDynamicModuleBuilder<IsaacModuleType, Consumer>) => {
            builder.acceptBoundImport(options[ISAAC_SEED_BUFFER]);

            const exportGen = options[ISAAC_GENERATOR];
            if (!! exportGen) {
               builder.exportFromSupplier(exportGen, ISAAC_GENERATOR_PROVIDER_TOKEN);
            }
         }
      );
   }

   // For Future TODO
   // forSequenceFeature(_module: ModuleIdentifier) { }
}
