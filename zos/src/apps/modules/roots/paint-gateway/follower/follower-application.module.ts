import {Module} from '@nestjs/common';
import { Canvas } from "canvas";

import { CoroutinesModule } from '@jchptf/coroutines';
import { ResourceSemaphoreModule } from '@jchptf/semaphore';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';
import { ConfigModule } from '@jchptf/config';

import { FollowerApplication } from './follower-application.service';
import { followerChannelProviders } from './follower-channels.provider';
import { APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG, SEMAPHORE_MODULE_CANVAS_OPTIONS } from './application.constants';
import { CanvasCalculator } from './components';

@Module({
   imports: [
      CoroutinesModule,
      ConfigModule.forRootWithFeature(
         {},
         APPLICATION_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './build/test/fixtures'
      ),
      ResourceSemaphoreModule.forFeature<Canvas>(
         APPLICATION_MODULE_ID, {
            style: AsyncModuleParamStyle.VALUE,
            useValue: SEMAPHORE_MODULE_CANVAS_OPTIONS
         }, CANVAS_APP_SEMAPHORE_TAG),
   ],
   controllers: [ ],
   providers: [CanvasCalculator, FollowerApplication, ...followerChannelProviders],
   exports: [CoroutinesModule, ConfigModule, CanvasCalculator, FollowerApplication]
})
export class FollowerApplicationModule
{
   constructor( ) { }
}