import {DynamicModule, Module} from '@nestjs/common';
import {
   LOAD_RESOURCE_SEMAPHORE_STRATEGY_CONFIGURATION, RESOURCE_SEMAPHORE_FACTORY_SERVICE
} from './resource-semaphore.constants';
import {getReservationChannelToken, getResourceSemaphoreToken} from './resource-semaphore.token-factory';
import {LoadResourcePoolStrategyConfig} from '../interfaces/load-strategy-config.interface';
import {ResourceSemaphoreFactory} from '../resource-semaphore-factory.class';
import {IResourceSemaphoreFactory} from '../interfaces/resource-semaphore-factory.interface';
import {ResourceSemaphore} from '../resource-semaphore.class';
import {IResourceAdapter} from '../interfaces/resource-adapter.interface';
import {Chan} from 'medium';
import {CoRoutinesSupportModule} from './coroutines-support.module';

@Module({})
export class ResourceSemaphoreModule
{
   public static forRoot<T extends object>(config: LoadResourcePoolStrategyConfig<T>): DynamicModule
   {
      const resourceSemaphoreConfiguration = {
         provide: LOAD_RESOURCE_SEMAPHORE_STRATEGY_CONFIGURATION,
         useValue: config,
      };

      const resourceSemaphoreFactoryProvider = {
         provide: RESOURCE_SEMAPHORE_FACTORY_SERVICE,
         useClass: ResourceSemaphoreFactory
         // useFactory: async (concurrentWorkFactory: IConcurrentWorkFactory) =>
         //    new ResourceSemaphoreFactory(concurrentWorkFactory)
         // inject: [ConcurrentWorkFactory]
      };

      const resourceSemaphoreProvider = {
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

      const semaphoreReservationsProvider = {
         provide: getReservationChannelToken(config),
         useFactory:  async (sem: ResourceSemaphore<any>): Promise<Chan<IResourceAdapter<any>, any>> => {
            return sem.getReservationChan();
         },
         inject: [ getResourceSemaphoreToken<T>(config) ]
      };

      const semaphoreReturnsProvider = {
         provide: getReservationChannelToken(config),
         useFactory:  async (sem: ResourceSemaphore<any>): Promise<Chan<IResourceAdapter<any>, any>> => {
            return sem.getReservationChan();
         },
         inject: [ getResourceSemaphoreToken<T>(config) ]
      }

      return {
         module: ResourceSemaphoreModule,
         imports: [CoRoutinesSupportModule],
         providers: [
            resourceSemaphoreFactoryProvider,
            resourceSemaphoreProvider,
            resourceSemaphoreConfiguration,
            semaphoreReservationsProvider,
            semaphoreReturnsProvider
         ],
         exports: [resourceSemaphoreProvider],
      };
   }
}

// @Global()
// @Module({})
// class GlobalResourcePoolModule
// {
//
// }