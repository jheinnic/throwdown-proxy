import {Inject, Module} from '@nestjs/common';
import {Canvas} from 'canvas';

import {CoroutinesModule} from '@jchptf/coroutines';
import {IResourceSemaphore, ResourceSemaphoreModule} from '@jchptf/semaphore';
import {ConfigModule} from '@jchptf/config';
import {
   APPLICATION_CANVAS_SEMAPHORE_PROVIDER, APPLICATION_MODULE_ID, SEMAPHORE_MODULE_OPTIONS
} from './application.constants';

@Module({
   imports: [
      CoroutinesModule,
      ResourceSemaphoreModule.forRoot<Canvas>(
         APPLICATION_MODULE_ID, SEMAPHORE_MODULE_OPTIONS),
      ConfigModule.forRoot(
         'apps/config/**/!(*.d).{ts,js}',
         {},
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
         inject: [APPLICATION_CANVAS_SEMAPHORE_PROVIDER]
      },
      // {
      //    provide: 'loadTest',
      //    useFactory: simulateWorkload,
      //    inject: [
      //       APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER,
      //       APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER
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