import 'reflect-metadata';
import {NestFactory} from '@nestjs/core';

import {FollowerApplicationModule} from '../modules/roots/paint-gateway/follower/follower-application.module';
import {FollowerApplication} from '../modules/roots/paint-gateway/follower/follower-application.provider';

async function bootstrap()
{
   try {
      console.log('Process starting');
         console.log('Follower starting');
         const ctx = await NestFactory.createApplicationContext(FollowerApplicationModule);
         console.log('Follower context loaded');
         const mainApp = ctx.get(FollowerApplication);
         console.log('Follower application', mainApp);
         console.log('Yielded', await mainApp.run());

         ctx.close();
         console.log('Closed follower context');
      console.log('Process returning');
   } catch (err) {
      console.error('ERROR', err);
   }
}

bootstrap()
   .then(() => {
      console.log('Bootstrap completed!')
   })
   .catch((err: any) => {
      console.error('Bootstrap failed!', err);
   });
console.log('Returned from async bootstrap.');

let counter = 0;
setInterval(() => {
   counter++;
   console.log('Wooga wooga', ++counter);
}, 60000);
