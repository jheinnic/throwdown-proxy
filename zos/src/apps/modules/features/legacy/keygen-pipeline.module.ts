import { Global, Module } from '@nestjs/common';
import * as cluster from 'cluster';

import { ResourceSemaphoreModule } from '@jchptf/semaphore';
import { CoroutinesModule } from '@jchptf/coroutines';
import { ConsulModule } from '@jchptf/consul';
import { ConfigModule } from '@jchptf/config';
import { APPLICATION_MODULE_ID } from '../../roots/workload-sim/application.constants';
import { AsyncModuleParamStyle } from '@jchptf/nestjs';
import { SEMAPHORE_MODULE_OPTIONS } from '../../roots/workload-sim/semaphore-module-options.constants';
import { LeaderApplication } from '../../roots/paint-gateway/leader-application.class';

@Global()
@Module({
   imports: [
      CoroutinesModule,
      ResourceSemaphoreModule.forFeature<cluster.Worker>(
         APPLICATION_MODULE_ID, { style: AsyncModuleParamStyle.VALUE,
            useValue: SEMAPHORE_MODULE_OPTIONS }),
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