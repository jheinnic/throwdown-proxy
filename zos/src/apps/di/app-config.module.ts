import {Module} from '@nestjs/common';
import {
   ConfigModule, DOTENV_CONFIG_OPTIONS, DOTENV_CONFIG_OPTIONS_PROVIDER_TOKEN
} from '@jchptf/config';
import './app-config.constants';
import { APP_CONFIG_MODULE_ID } from './app-config.constants';
import { DynamicProviderBindingStyle, MODULE_ID } from '@jchptf/nestjs';

@Module({
   imports: [
      ConfigModule.forRootWithFeature({
         forModule: AppConfigModule,
         loadConfigGlob: 'apps/config/**/!(*.d).{ts,js}',
         resolveGlobRoot:
            process.env['NODE_ENV'] === 'production' || process.env['NODE_ENV'] === 'development'
               ? './dist' : './build/test/fixtures',
         [DOTENV_CONFIG_OPTIONS]: {
            style: DynamicProviderBindingStyle.VALUE,
            provide: DOTENV_CONFIG_OPTIONS_PROVIDER_TOKEN,
            useValue: {}
         },
      })
   ],
   providers: [ ],
   exports: [ ConfigModule ]
})
export class AppConfigModule
{
   public static readonly [MODULE_ID] = APP_CONFIG_MODULE_ID;

   constructor( )
   { }
}