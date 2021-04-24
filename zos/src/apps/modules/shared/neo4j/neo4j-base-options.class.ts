import { AuthToken, Config } from 'neo4j-driver/types/v1';
import { Required } from 'simplytyped';

export class Neo4JModuleConfig {
   public readonly authToken: AuthToken;
   public readonly url: string;
   public readonly config: Config;

   private static readonly DEFAULTS: Partial<Neo4JModuleConfig> = {
      url: "localhost:4747",
      config: {
         connectionPoolSize: 12,
         connectionTimeout: 2000,
         loadBalancingStrategy: 'least_connected',
         logging: {
            level: 'warn',
            logger: (level, message) => {
               if (level === 'warn') {
                  console.warn(message);
               } else if (level === 'error') {
                  console.error(message);
               }
            }
         },
         maxConnectionLifetime: 21600,
         maxConnectionPoolSize: 60,
         maxTransactionRetryTime: 20000,
         disableLosslessIntegers: false,
         encrypted: 'ENCRYPTION_ON'
         // trust: 'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES',
         // trustedCertificates:
      }
   }

   constructor(
      overrides: Required<INeo4JModuleConfig, 'authToken'>,
      prototype: Partial<INeo4JModuleConfig> = {}
   ) {
      this.authToken = { ...overrides.authToken };

      this.url = !overrides.url
         ? !prototype.url
            ? Neo4JModuleConfig.DEFAULTS.url!
            : prototype.url
         : overrides.url;

      this.config =
         Object.assign(
            {}, Neo4JModuleConfig.DEFAULTS.config,
            prototype.config, overrides.config);
   }
}

export interface INeo4JModuleConfig extends Neo4JModuleConfig {
}