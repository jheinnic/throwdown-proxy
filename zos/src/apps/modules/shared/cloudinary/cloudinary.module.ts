import { DynamicModule, Module } from '@nestjs/common';
import { buildDynamicModule, IDynamicModuleBuilder, IModule } from '@jchptf/nestjs';

import {
   CloudinaryModuleId, CloudinaryModuleType, CLOUDINARY_CREDENTIALS,
   CLOUDINARY_SERVER_CLIENT, CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN,
} from './cloudinary.constants';
import { CloudinaryClientFeatureOptions } from './cloudinary-client-feature-options.type';
import { CLOUDINARY_SERVER_CLIENT_PROVIDER } from './cloudinary-server-client-factory.provider';

@Module({
   imports: [],
   controllers: [],
   providers: [CLOUDINARY_SERVER_CLIENT_PROVIDER],
   exports: [CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN]
})
export class CloudinaryModule extends CloudinaryModuleId
{
   public static forServerClientFeature<Consumer extends IModule>(
      options: CloudinaryClientFeatureOptions<Consumer>): DynamicModule
   {
      return buildDynamicModule(
         CloudinaryModule,
         options.forModule,
         (builder: IDynamicModuleBuilder<CloudinaryModuleType, Consumer>) => {
            builder.acceptBoundImport(options[CLOUDINARY_CREDENTIALS]);

            const exportGen = options[CLOUDINARY_SERVER_CLIENT];
            if (!! exportGen) {
               builder.exportFromSupplier(
                  exportGen, CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN);
            }
         }
      );
   }

   // For Future TODO
   // forSequenceFeature(_module: ModuleIdentifier) { }
}
