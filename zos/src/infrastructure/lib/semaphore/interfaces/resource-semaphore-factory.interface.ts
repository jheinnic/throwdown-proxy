import {LoadResourcePoolStrategyConfig} from './load-strategy-config.interface';
import {IResourceSemaphore} from './resource-semaphore.interface';

export interface IResourceSemaphoreFactory
{
   createSemaphore<T extends object>(
      config: LoadResourcePoolStrategyConfig<T>): Promise<IResourceSemaphore<T>>;
}
