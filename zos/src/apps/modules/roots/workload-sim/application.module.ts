import { Inject, Module } from '@nestjs/common';
import { Canvas } from 'canvas';

import { CoroutinesModule } from '@jchptf/coroutines';
import {
   IResourceSemaphore, PoolSizes, SEMAPHORE_RESOURCE_POOL, SemaphoreModule
} from '@jchptf/semaphore';
import { ConfigModule } from '@jchptf/config';
import {
   ApplicationModuleId, CANVAS_SEMAPHORE_RESOURCE_POOL, CANVAS_SEMAPHORE_PROVIDER_TOKEN,
} from './application.constants';
import { DynamicProviderBindingStyle } from '@jchptf/nestjs';


@Module({
   imports: [
      CoroutinesModule,
      SemaphoreModule.forFeature<Canvas, typeof ApplicationModuleId>({
         forModule: ApplicationModuleId,
         [SEMAPHORE_RESOURCE_POOL]: {
            style: DynamicProviderBindingStyle.VALUE,
            useValue: CANVAS_SEMAPHORE_RESOURCE_POOL
         }
      }),
      ConfigModule.forRootWithFeature({
         forModule: ApplicationModuleId,
         resolveGlobRoot: 'apps/config/**/!(*.d).{ts,js}',
         loadConfigGlob: process.env['NODE_ENV'] === 'production'
            ? './dist' : './build/test/fixtures',
      })
   ],
   providers: [
      {
         provide: 'temp',
         useFactory: (semaphore: IResourceSemaphore<Canvas>) => {
            console.log('Adding watcher');
            const retVal = semaphore.addWatch(
               'stress', (id: string, _old: PoolSizes, newSizes: PoolSizes) => {
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
      //       CANVAS_SEMAPHORE_RECYCLING_CHANNEL_PROVIDER_TOKEN
      //    ]
      // }
   ],
   exports: [CoroutinesModule, SemaphoreModule, ConfigModule, 'temp']
})
export class ApplicationModule extends ApplicationModuleId
{
   constructor( @Inject('temp') watcher: any )
   {
      super();
      console.log('lil watcher, watcher', watcher);
   }
}