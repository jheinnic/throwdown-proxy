import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { v1 as neo4j } from 'neo4j-driver';

import { AsyncModuleParam, asyncProviderFromParam, ModuleIdentifier } from '@jchptf/nestjs';
import { Neo4JConfig } from '../config/neo4j-config.interface';
import { NEO4J_CONFIG_PROVIDER_TOKEN } from './neo4j.constants';
import { getDynamicNeo4JDriverProviderToken } from './neo4j.utilities';

@Module({
   imports: [
      GraphQLModule.forRoot({
         typePaths: ['./**/*.graphql'],
         debug: true,
         playground: true,
      }),
   ],
})
export class Neo4JModule
{
   public static forFeature(
      moduleId: ModuleIdentifier,
      neo4jConfig: AsyncModuleParam<Neo4JConfig>,
      discriminatorTag?: string): DynamicModule
   {
      const configProvider =
         asyncProviderFromParam<Neo4JConfig>(
            NEO4J_CONFIG_PROVIDER_TOKEN, neo4jConfig);

      const driverProviderToken =
         getDynamicNeo4JDriverProviderToken(moduleId, discriminatorTag);
      // const sessionProviderToken =
      //    getDynamicNeo4JSessionProviderToken(moduleId, discriminatorTag);

      const driverProvider = {
         provide: driverProviderToken,
         useFactory: (config: Neo4JConfig) => {
            return neo4j.driver(
               config.url, config.authToken, config.config);
         },
         inject: [NEO4J_CONFIG_PROVIDER_TOKEN]
      };

      // const sessionProvider = {
      //    provide: sessionProviderToken,
      //    useFactory: (driver: neo4j.Driver) => {
      //       return driver.session();
      //    },
      //    inject: [NEO4J_CONFIG_PROVIDER_TOKEN]
      // };

      // TODO: How to register cleanup (driver.close()) on shutdown?
      return {
         module: Neo4JModule,
         imports: [],
         providers: [ ...configProvider, driverProvider ],
         exports: [ ...configProvider, driverProvider ]
      }
   }
}