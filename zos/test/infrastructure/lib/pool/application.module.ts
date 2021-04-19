import {CoroutinesModule} from '@jchptf/coroutines';
import {
   SEMAPHORE_RESOURCE_POOL, SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN, SemaphoreModule
} from '@jchptf/semaphore';
import {Canvas} from 'canvas';
import { Module } from '@nestjs/common';
import { DynamicProviderBindingStyle } from '@jchptf/nestjs';
import { ApplicationModuleId } from './application.constants';

@Module({
   imports: [
      CoroutinesModule,
      SemaphoreModule.forFeature({
            forModule: ApplicationModuleId,
            [SEMAPHORE_RESOURCE_POOL]: {
               style: DynamicProviderBindingStyle.VALUE,
               provide: SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN,
               useValue: [
                  new Canvas(400, 400), new Canvas(400, 400),
                  new Canvas(400, 400), new Canvas(400, 400)
               ],
            }
         }
      )
   ]
})
export class ApplicationModule extends ApplicationModuleId
{ }
