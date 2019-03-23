import { Global, Module } from '@nestjs/common';
import * as cluster from 'cluster';

import { ResourceSemaphoreModule } from '@jchptf/semaphore';
import { CoroutinesModule } from '@jchptf/coroutines';
import { ConsulModule } from '@jchptf/consul';
import { ConfigModule } from '@jchptf/config';
import { APPLICATION_MODULE_ID } from '../../roots/workload-sim/application.constants';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';
import { LeaderApplication } from '../../roots/paint-gateway/leader/leader-application.class';
import { WorkerPool } from '../../roots/paint-gateway/leader/worker-pool.service';

@Global()
@Module({
   imports: [
      CoroutinesModule,
      ResourceSemaphoreModule.forFeature<cluster.Worker>(
         APPLICATION_MODULE_ID, ApplicationModule, {
            style: AsyncModuleParamStyle.EXISTING,
            useExisting: WorkerPool,
            // useFactory: (workerPool: WorkerPool) => workerPool,
            // inject: [WorkerPool]
            // useValue: new WorkerPool()
         }),
      ConfigModule.forRootWithFeature(
         {},
         APPLICATION_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './dist'
      ),
      ConsulModule.forRoot({
         style: AsyncModuleParamStyle.VALUE,
         useValue: {
            host: 'localhost',
            secure: false
            // defaults: {
            //    token: v1.auth.basic('jheinnic', 'abcd1234')
            // }
         }
      })
   ],
   controllers: [],
   providers: [LeaderApplication],
   exports: [
      CoroutinesModule, ResourceSemaphoreModule, ConfigModule, LeaderApplication
   ]
})
export class ApplicationModule
{}