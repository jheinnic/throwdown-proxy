import { DynamicModule, Module } from '@nestjs/common';

import {
   NEO4J_DRIVER, NEO4J_DRIVER_PROVIDER_TOKEN, NEO4J_MODULE_CONFIG, Neo4JModuleId, Neo4JModuleType
} from './neo4j.constants';
import { Neo4JFeatureModuleOptions } from './neo4j-feature-module-options.type';
import { buildDynamicModule, IDynamicModuleBuilder, IModule } from '@jchptf/nestjs';
import { NEO4J_DRIVER_PROVIDER } from './neo4j.providers';

@Module({
   // imports: [
   //    GraphQLModule.forRoot({
   //       typePaths: ['./**/*.graphql'],
   //       debug: true,
   //       playground: true,
   //    }),
   // ],
})
export class Neo4JModule extends Neo4JModuleId
{
   public static forFeature<Consumer extends IModule>(
      options: Neo4JFeatureModuleOptions<Consumer>): DynamicModule
   {
      // TODO: How to register cleanup (driver.close()) on shutdown?
      return buildDynamicModule<Neo4JModuleType, Consumer>(
         Neo4JModule,
         options.forModule,
         (builder: IDynamicModuleBuilder<Neo4JModuleType, Consumer>) => {
            const exportDriver = options[NEO4J_DRIVER];
            if (!! exportDriver) {
               builder.acceptBoundImport(options[NEO4J_MODULE_CONFIG])
                  .acceptBoundImport(NEO4J_DRIVER_PROVIDER)
                  .exportFromSupplier(exportDriver, NEO4J_DRIVER_PROVIDER_TOKEN);
            }
         },
      );
   }
}
