import { Module } from '@nestjs/common';
import * as cluster from 'cluster';
import * as util from 'util';

import { ResourceSemaphoreModule } from '@jchptf/semaphore';
import { CoroutinesModule } from '@jchptf/coroutines';
import { ConsulModule } from '@jchptf/consul';
import { ConfigModule } from '@jchptf/config';
import { MerkleModule } from '@jchptf/merkle';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';

// import { AppConfigConstants } from '../../../config/app-config.constants';
// import APP_BOOTSTRAP_PROVIDER_TOKEN = AppConfigConstants.APP_BOOTSTRAP_PROVIDER_TOKEN;

import { LeaderApplication } from './leader-application.class';
import { IsaacModule } from '../../../shared/isaac/isaac.module';
import { APPLICATION_MODULE_ID } from './application.constants';
import {
   APPLICATION_SEMAPHORE_TAG, SEMAPHORE_MODULE_OPTIONS
} from '../../workload-sim/application.constants';

@Module({
   imports: [
      CoroutinesModule,
      IsaacModule,
      ResourceSemaphoreModule.forFeature<cluster.Worker>(
         APPLICATION_MODULE_ID, {
            style: AsyncModuleParamStyle.VALUE,
            useValue: SEMAPHORE_MODULE_OPTIONS
         }, APPLICATION_SEMAPHORE_TAG),

      ConfigModule.forRootWithFeature(
         {},
         APPLICATION_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './build/test/fixtures'
      ),
      ConsulModule.forRoot({
         style: AsyncModuleParamStyle.VALUE,
         useValue: {
            host: 'localhost',
            secure: false,
            promisify: util.promisify
         }
      }),
      MerkleModule
   ],
   controllers: [],
   providers: [LeaderApplication],
   exports: [
      CoroutinesModule, IsaacModule, ResourceSemaphoreModule, ConfigModule, MerkleModule,
      LeaderApplication, // ...followerChannelProviders
   ]
})
export class LeaderApplicationModule
{}