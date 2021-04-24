import { Driver } from 'neo4j-driver/types/v1';
import { v1 as neo4j } from 'neo4j-driver';

import {
   NEO4J_DRIVER_PROVIDER_TOKEN, NEO4J_MODULE_CONFIG_PROVIDER_TOKEN, Neo4JModuleType
} from './neo4j.constants';
import { Neo4JModuleConfig } from './neo4j-base-options.class';
import { DynamicProviderBindingStyle, IBoundDynamicModuleImport } from '@jchptf/nestjs';

export const NEO4J_DRIVER_PROVIDER: IBoundDynamicModuleImport<Driver, Neo4JModuleType> = {
   style: DynamicProviderBindingStyle.SUPPLIER_INJECTED_FUNCTION,
   provide: NEO4J_DRIVER_PROVIDER_TOKEN,
   useFactory: (config: Neo4JModuleConfig): Driver => {
      return neo4j.driver(config.url, config.authToken, config.config);
   },
   inject: [NEO4J_MODULE_CONFIG_PROVIDER_TOKEN]
};
