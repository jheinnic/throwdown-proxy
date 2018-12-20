import {DynamicModule, Module} from '@nestjs/common';
import {
   LOAD_RESOURCE_SEMAPHORE_STRATEGY_CONFIGURATION, RESOURCE_SEMAPHORE_FACTORY_SERVICE
} from './resource-semaphore.constants';
import {getResourceSemaphoreToken} from './resource-semaphore.token-factory';
import {LoadResourcePoolStrategyConfig} from '../interfaces/load-strategy-config.interface';
import {CO_TYPES, ConcurrentWorkFactory} from '@jchptf/coroutines';
import {ResourceSemaphoreFactory} from '../resource-semaphore-factory.class';
import {IResourceSemaphoreFactory} from '../interfaces/resource-semaphore-factory.interface';

@Module({})
export class ResourceSemaphoreModule
{
   public static forRoot<T extends object>(config: LoadResourcePoolStrategyConfig<T>): DynamicModule
   {
      const resourceSemaphoreConfiguration = {
         provide: LOAD_RESOURCE_SEMAPHORE_STRATEGY_CONFIGURATION,
         useValue: config,
      };

      const loadResourceSemaphoreFactoryProvider = {
         provide: RESOURCE_SEMAPHORE_FACTORY_SERVICE,
         useClass: ResourceSemaphoreFactory
         // useFactory: async (concurrentWorkFactory: IConcurrentWorkFactory) =>
         //    new ResourceSemaphoreFactory(concurrentWorkFactory)
         // inject: [ConcurrentWorkFactory]
      };

      const loadResourceSemaphoreProvider = {
         provide: getResourceSemaphoreToken<T>(config),
         useFactory: async (
            semaphoreFactory: IResourceSemaphoreFactory,
            config: LoadResourcePoolStrategyConfig<T>) => {
            return await semaphoreFactory.createSemaphore(config);
         },
         inject: [
            RESOURCE_SEMAPHORE_FACTORY_SERVICE,
            LOAD_RESOURCE_SEMAPHORE_STRATEGY_CONFIGURATION
         ]
      };

      return {
         module: ResourceSemaphoreModule,
         imports: [ConcurrentWorkFactory],
         providers: [
            loadResourceSemaphoreFactoryProvider,
            loadResourceSemaphoreProvider,
            resourceSemaphoreConfiguration],
         exports: [loadResourceSemaphoreProvider],
      };
   }
}

// @Global()
// @Module({})
// class GlobalResourcePoolModule
// {
//
// }