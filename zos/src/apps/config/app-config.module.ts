import {Inject, Module} from '@nestjs/common';
import {ConfigModule} from '@jchptf/config';
import { APP_MODULE_ID } from '../modules/roots/paint-gateway/application.constants';

@Module({
   imports: [
      ConfigModule.forRootWithFeature(
         {},
         APP_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' || process.env['NODE_ENV'] === 'development'
            ? './dist'
            : './build/test/fixtures'
      )
   ],
   providers: [ ],
   exports: [ ConfigModule ]
})
export class AppConfigModule
{

   constructor(
      @Inject('temp') watcher: any
   )
   {
      console.log('lil watcher, watcher', watcher);
   }
}