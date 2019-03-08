import {Module} from '@nestjs/common';

import {CoroutinesModule} from '@jchptf/coroutines';
import {ConfigModule} from '@jchptf/config';
import {FollowerApplication} from './follower-application.provider';
import {followerChannelProviders} from './follower-channels.provider';
import { APP_MODULE_ID } from './follower-application.constants';

@Module({
   imports: [
      CoroutinesModule,
      ConfigModule.forRootWithFeature(
         {},
         APP_MODULE_ID,
         'apps/config/**/!(*.d).{ts,js}',
         process.env['NODE_ENV'] === 'production' ? './dist' : './build/test/fixtures'
      )
   ],
   controllers: [ ],
   providers: [FollowerApplication, ...followerChannelProviders],
   exports: [CoroutinesModule, ConfigModule, FollowerApplication]
})
export class FollowerApplicationModule
{
   constructor( ) { }
}