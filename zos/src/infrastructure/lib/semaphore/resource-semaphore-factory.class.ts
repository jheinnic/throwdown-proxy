import {map, toArray} from 'rxjs/operators';
import {range} from 'rxjs';

import '@jchptf/reflection';
import {CO_TYPES, IConcurrentWorkFactory} from '@jchptf/coroutines';

import {
   LoadResourcePoolStrategy, LoadResourcePoolStrategyConfig
} from './interfaces/load-strategy-config.interface';
import {IResourceSemaphore} from './interfaces/resource-semaphore.interface';
import {Inject, Injectable} from '@nestjs/common';
import {ResourceSemaphore} from './resource-semaphore.class';
import {IResourceSemaphoreFactory} from './interfaces/resource-semaphore-factory.interface';


@Injectable()
export class ResourceSemaphoreFactory implements IResourceSemaphoreFactory
{
   constructor(
      @Inject(CO_TYPES.ConcurrentWorkFactory) private readonly concurrentWorkFactory: IConcurrentWorkFactory)
   { }

   async createSemaphore<T extends object>(config: LoadResourcePoolStrategyConfig<T>):
      Promise<IResourceSemaphore<T>>
   {
      const resources: Array<T> = await this.acquireResources(config);

      return new ResourceSemaphore<T>(config.name, resources, this.concurrentWorkFactory);
   }

   private async acquireResources<T extends object>(
      resourceSupplyConfig: LoadResourcePoolStrategyConfig<T> ): Promise<Array<T>>
   {
      switch (resourceSupplyConfig.loadStrategy) {
         case LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE:
         {
            return [...resourceSupplyConfig.resources];
         }

         case LoadResourcePoolStrategy.EAGER_FIXED_ASYNC_ITERABLE:
         {
            const resources: Array<T> = new Array<T>();
            let nextResource: T;
            for await (nextResource of resourceSupplyConfig.resources) {
               resources.push(nextResource);
            }

            return resources;
         }

         case LoadResourcePoolStrategy.EAGER_FIXED_CALL_FACTORY:
         {
            const factory = resourceSupplyConfig.factory;

            const rawArray = await range(1, resourceSupplyConfig.poolSize)
               .pipe(
                  map((): T => factory()),
                  toArray()
               )
               .toPromise();

            const retVal = new Array<T>(rawArray.length);
            for (let ii = 0; ii < retVal.length; ii++) {
               retVal[ii] = await rawArray[ii];
            }

            return retVal;
         }

         default:
         {
            return this as never;
         }
      }
   }
}