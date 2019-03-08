import { Module } from '@nestjs/common';
import { v1 as neo4j } from 'neo4j-driver';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';

import { EcosystemResolver } from '../resolvers/ecosystem.resolver';
import { Neo4JModule } from '../../../shared/neo4j/di/neo4j.module';
import { EcosystemClient } from '../service/ecosystem-client.service';
import { APP_MODULE_ID } from '../../../roots/paint-gateway/application.constants';

@Module({
   imports: [
      Neo4JModule.forFeature(APP_MODULE_ID, {
         style: AsyncModuleParamStyle.VALUE,
         useValue: {
            authToken: neo4j.auth.basic("neo4j", "neo4j"),
            url: "localhost:4747",
            config: { }
         }
      })
   ],
   providers: [EcosystemClient, EcosystemResolver],
   exports: [Neo4JModule, EcosystemClient, EcosystemResolver]
})
export class GeneGameModule {

}