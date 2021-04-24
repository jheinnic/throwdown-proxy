import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';
import { Driver, Session } from 'neo4j-driver/types/v1';
import { Neo4JModuleConfig } from './neo4j-base-options.class';

export const NEO4J_MODULE = Symbol('@jchptf/neo4j');
export type NEO4J_MODULE = typeof NEO4J_MODULE;

export const NEO4J_DRIVER = Symbol('Neo4JDriver');
export const NEO4J_SESSION = Symbol('Neo4JSession');
export const NEO4J_MODULE_CONFIG = Symbol('Neo4JConfig');

export class Neo4JModuleId
{
   public static readonly [MODULE_ID] = NEO4J_MODULE;

   [NEO4J_DRIVER]: Driver;

   [NEO4J_SESSION]: Session;

   [NEO4J_MODULE_CONFIG]: Neo4JModuleConfig;
}

export type Neo4JModuleType = typeof Neo4JModuleId;

function blessLocal<Token extends keyof Neo4JModuleId>(token: Token):
   LocalProviderToken<Neo4JModuleId[Token], Neo4JModuleType, Token>
{
   return blessLocalProviderToken(token, Neo4JModuleId);
}

export const NEO4J_MODULE_CONFIG_PROVIDER_TOKEN = blessLocal(NEO4J_MODULE_CONFIG);
export const NEO4J_DRIVER_PROVIDER_TOKEN = blessLocal(NEO4J_DRIVER);
export const NEO4J_SESSION_PROVIDER_TOKEN = blessLocal(NEO4J_SESSION);

// export const NEO4J_DYNAMIC_DRIVER_PROVIDER_BINDING =
//    getDynamicProviderBinding(NEO4J_MODULE, 'Neo4JDriver');
