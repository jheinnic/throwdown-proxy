import {Module} from '@nestjs/common';
import { Canvas } from "canvas";

import { CoroutinesModule } from '@jchptf/coroutines';
import { ResourceSemaphoreModule } from '@jchptf/semaphore';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';
import { ConfigModule } from '@jchptf/config';

import { FollowerApplication } from './follower-application.service';
import { followerChannelProviders } from './follower-channels.provider';
import { APPLICATION_MODULE_ID } from './follower-application.constants';
import { CanvasCalculator } from './components';
import { FollowerAutoDriver } from './experiment/follower-auto-driver.service';
import { IAdapter } from '@jchptf/api';

const CANVAS_SEMAPHORE_RESOURCE_POOL: IAdapter<Canvas>[] =
   new Array<IAdapter<Canvas>>(4);
for (let ii = 0; ii < 4; ii += 1) {
   const tempCanvas = new Canvas(400, 400);
   tempCanvas.getContext('2d');
   CANVAS_SEMAPHORE_RESOURCE_POOL[ii] = {
      unwrap() { return tempCanvas; }
   }
}

@Module({
   imports: [
      CoroutinesModule,
      ConfigModule.forRootWithFeature(
         {},
         APPLICATION_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './dist'
      ),
      ConfigModule.forFeature(
         APPLICATION_MODULE_ID,
         'apps/modules/roots/paint-gateway/follower/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './dist'
      ),
      ResourceSemaphoreModule.forFeature<IAdapter<Canvas>>(
         APPLICATION_MODULE_ID, FollowerApplicationModule, {
            style: AsyncModuleParamStyle.VALUE,
            useValue: CANVAS_SEMAPHORE_RESOURCE_POOL
         }),
   ],
   controllers: [ ],
   providers: [
      CanvasCalculator, ...followerChannelProviders,
      FollowerApplication, FollowerAutoDriver,
   ],
   exports: [
      CoroutinesModule, ConfigModule, CanvasCalculator,
      FollowerApplication, FollowerAutoDriver,
   ]
})
export class FollowerApplicationModule
{
   constructor( ) { }
}