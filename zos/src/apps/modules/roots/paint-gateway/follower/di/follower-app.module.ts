import { Module } from '@nestjs/common';
import { Canvas } from 'canvas';

import { DynamicProviderBindingStyle } from '@jchptf/nestjs';
import { CoroutinesModule } from '@jchptf/coroutines';
import {
   SEMAPHORE_RESOURCE_POOL, SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN, SemaphoreModule
} from '@jchptf/semaphore';
import { ConfigModule } from '@jchptf/config';
import { IAdapter } from '@jchptf/api';

import { CanvasCalculator, FollowerAutoDriver, FollowerApplication } from '../components';
import { followerChannelProviders } from './follower-channels.provider';
import { FollowerAppModuleId } from './follower-app.constants';
import { CANVAS_SEMAPHORE_RESOURCE_POOL } from './follower-app.providers';

@Module({
   imports: [
      CoroutinesModule,
      ConfigModule.forFeature<typeof FollowerAppModuleId>({
         forModule: FollowerAppModule,
         resolveGlobRoot: 'apps/config/**/!(*.d).{ts,js}',
         loadConfigGlob: process.env['NODE_ENV'] === 'production' ? './dist' : './dist',
      }),
      ConfigModule.forFeature<typeof FollowerAppModuleId>({
         forModule: FollowerAppModule,
         resolveGlobRoot: 'apps/config/**/!(*.d).{ts,js}',
         loadConfigGlob: process.env['NODE_ENV'] === 'production' ? './dist' : './dist',
      }),
      SemaphoreModule.forFeature<IAdapter<Canvas>, typeof FollowerAppModuleId>({
         forModule: FollowerAppModuleId,
         [SEMAPHORE_RESOURCE_POOL]: {
            style: DynamicProviderBindingStyle.VALUE,
            provide: SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN,
            useValue: CANVAS_SEMAPHORE_RESOURCE_POOL,
         },
      })
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
export class FollowerAppModule extends FollowerAppModuleId
{
   constructor( )
   {
      super();
   }
}