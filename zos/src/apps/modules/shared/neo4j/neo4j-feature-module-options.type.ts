import { DynamicModuleConfigTwo, IBaseConfigProps, IModule } from '@jchptf/nestjs';

import { NEO4J_DRIVER, NEO4J_MODULE_CONFIG, Neo4JModuleId } from './neo4j.constants';

export type Neo4JFeatureModuleOptions<Consumer extends IModule> =
   DynamicModuleConfigTwo<
      typeof Neo4JModuleId,
      IBaseConfigProps<Consumer>,
      Neo4JModuleId,
      typeof NEO4J_MODULE_CONFIG,
      never,
      typeof NEO4J_DRIVER
   >;
