import { Module } from '@nestjs/common';
import * as util from 'util';

import {
   SEMAPHORE_RESOURCE_POOL, SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN, SemaphoreModule
} from '@jchptf/semaphore';
import { CONSUL_OPTIONS, CONSUL_OPTIONS_PROVIDER_TOKEN, ConsulModule } from '@jchptf/consul';
import { CoroutinesModule } from '@jchptf/coroutines';
import { DynamicProviderBindingStyle } from '@jchptf/nestjs';
import { ConfigModule } from '@jchptf/config';
import { MerkleModule } from '@jchptf/merkle';

// import { AppConfigConstants } from '../../../config/app-config.constants';
// import APP_BOOTSTRAP_PROVIDER_TOKEN = AppConfigConstants.APP_BOOTSTRAP_PROVIDER_TOKEN;

import { LeaderApplication } from './leader-application.class';
import { IsaacModule } from '../../../shared/isaac/isaac.module';
import { WorkerPool } from './worker-pool.service';
import { LeaderApplicationModuleId } from './leader-application.constants';

@Module({
   imports: [
      CoroutinesModule,
      IsaacModule,
      SemaphoreModule.forFeature({  // <cluster.Worker, LeaderApplicationModuleId>({
         forModule: LeaderApplicationModuleId,
         [SEMAPHORE_RESOURCE_POOL]: {
            style: DynamicProviderBindingStyle.CLASS,
            provide: SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN,
            useClass: WorkerPool,
         }
         // useFactory: (workerPool: WorkerPool) => workerPool,
         // inject: [WorkerPool]
         // useValue: new WorkerPool()
      }),
      ConfigModule.forRootWithFeature({
         forModule: LeaderApplicationModuleId,
         resolveGlobRoot: 'apps/config/**/!(*.d).{ts,js}',
         loadConfigGlob: process.env['NODE_ENV'] === 'production'
            ? './dist' : './build/test/fixtures',
      }),
      ConsulModule.forRoot({
         forModule: LeaderApplicationModuleId,
         [CONSUL_OPTIONS]: {
            style: DynamicProviderBindingStyle.VALUE,
            provide: CONSUL_OPTIONS_PROVIDER_TOKEN,
            useValue: {
               host: 'localhost',
               secure: false,
               promisify: util.promisify
            }
         }
      }),
      MerkleModule
   ],
   controllers: [],
   providers: [WorkerPool, LeaderApplication],
   exports: [
      CoroutinesModule, IsaacModule, SemaphoreModule, ConfigModule, MerkleModule,
      LeaderApplication, WorkerPool
   ]
})
export class LeaderApplicationModule
{}