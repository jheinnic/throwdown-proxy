import { Driver } from 'neo4j-driver/types/v1';
import { DynamicProviderToken, getDynamicProviderToken, ModuleIdentifier } from '@jchptf/nestjs';

import {
   NEO4J_DRIVER_CLASS, NEO4J_DYNAMIC_DRIVER_PROVIDER_BINDING, NEO4J_SESSION_CLASS
} from './neo4j.constants';

export function getDynamicNeo4JDriverProviderToken(
   moduleId: ModuleIdentifier, tag?: string ): DynamicProviderToken<Driver>
{
   return getDynamicProviderToken(
      moduleId, NEO4J_DYNAMIC_DRIVER_PROVIDER_BINDING, NEO4J_DRIVER_CLASS, tag);
}

export function getDynamicNeo4JSessionProviderToken(
   moduleId: ModuleIdentifier, tag?: string ): DynamicProviderToken<Driver>
{
   return getDynamicProviderToken(
      moduleId, NEO4J_DYNAMIC_DRIVER_PROVIDER_BINDING, NEO4J_SESSION_CLASS, tag);
}