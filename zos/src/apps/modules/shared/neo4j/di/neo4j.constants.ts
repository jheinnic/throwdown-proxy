import {
   getDynamicProviderBinding, getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent,
   TypeIdentifier
} from '@jchptf/nestjs';
import { Driver, Session } from 'neo4j-driver/types/v1';
import { Neo4JConfig } from '../config/neo4j-config.interface';

export const NEO4J_MODULE = getModuleIdentifier('@jchptf/neo4j');

export const NEO4J_DRIVER_CLASS: TypeIdentifier<Driver> =
   getNamedTypeIntent<Driver>('Neo4JDriver');

export const NEO4J_SESSION_CLASS: TypeIdentifier<Session> =
   getNamedTypeIntent<Session>('Neo4JSession');

export const NEO4J_MODULE_CONFIG_CLASS =
   getNamedTypeIntent<Neo4JConfig>('Neo4JConfig');

export const NEO4J_CONFIG_PROVIDER_TOKEN =
   getLocalProviderToken(NEO4J_MODULE, NEO4J_MODULE_CONFIG_CLASS);

export const NEO4J_DRIVER_PROVIDER_TOKEN =
   getLocalProviderToken(NEO4J_MODULE, NEO4J_DRIVER_CLASS);

export const NEO4J_SESSION_PROVIDER_TOKEN =
   getLocalProviderToken(NEO4J_MODULE, NEO4J_SESSION_CLASS);

export const NEO4J_DYNAMIC_DRIVER_PROVIDER_BINDING =
   getDynamicProviderBinding(NEO4J_MODULE, 'Neo4JDriver');
