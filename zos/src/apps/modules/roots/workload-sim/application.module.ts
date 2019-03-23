import { Inject, Module } from '@nestjs/common';
import { Canvas } from 'canvas';

import { CoroutinesModule } from '@jchptf/coroutines';
import { IResourceSemaphore, PoolSizes, ResourceSemaphoreModule } from '@jchptf/semaphore';
import { ConfigModule } from '@jchptf/config';
import {
   APPLICATION_MODULE_ID, CANVAS_SEMAPHORE_RESOURCE_POOL, CANVAS_SEMAPHORE_PROVIDER_TOKEN,
   CANVAS_SEMAPHORE_TAG,
} from './application.constants';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';

@Module({
   imports: [
      CoroutinesModule,
      ResourceSemaphoreModule.forFeature<Canvas>(
         APPLICATION_MODULE_ID,
         ApplicationModule, {
            style: AsyncModuleParamStyle.VALUE,
            useValue: CANVAS_SEMAPHORE_RESOURCE_POOL
         }, CANVAS_SEMAPHORE_TAG),
      ConfigModule.forRootWithFeature(
         {},
         APPLICATION_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './build/test/fixtures'
      )
   ],
   providers: [
      {
         provide: 'temp',
         useFactory: (semaphore: IResourceSemaphore<Canvas>) => {
            console.log('Adding watcher');
            const retVal = semaphore.addWatch(
               'strtest', (id: string, _old: PoolSizes, newSizes: PoolSizes) => {
                  console.log('watch notifier receives', newSizes, id);
               }
            );

            console.log('Watcher added.  Returning from factory');
            return retVal;
         },
         inject: [CANVAS_SEMAPHORE_PROVIDER_TOKEN]
      },
      // {
      //    provide: 'loadTest',
      //    useFactory: simulateWorkload,
      //    inject: [
      //       CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER_TOKEN,
      //       CANVAS_SEMAPHORE_RETURN_CHANNEL_PROVIDER_TOKEN
      //    ]
      // }
   ],
   exports: [
      CoroutinesModule, ResourceSemaphoreModule, ConfigModule, 'temp'
   ]
})
export class ApplicationModule
{

   constructor(
      @Inject('temp') watcher: any
      // @Inject('loadTest') loadTest: any
   )
   {
      // console.log('lil watcher, watcher', watcher, 'load tester', loadTest);
      console.log('lil watcher, watcher', watcher);
   }
}