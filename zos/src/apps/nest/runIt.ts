import 'reflect-metadata';
import * as fs from 'fs';
import {NestFactory} from '@nestjs/core';

import {ApplicationModule} from './application.module';
import {
   APPLICATION_CANVAS_SEMAPHORE_PROVIDER, APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER,
   APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER
} from './application.constants';
import {simulateWorkload} from './simulate-workload.function';

async function bootstrap()
{
   console.log('Starting app context');
   const app = await NestFactory.createApplicationContext(ApplicationModule);
   console.log('Awaited app context');

   const resourceSemaphore = app.get(APPLICATION_CANVAS_SEMAPHORE_PROVIDER);
   const acquireChan = app.get(APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER);
   const recycleChan = app.get(APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER);

   // logic...
   simulateWorkload(acquireChan, recycleChan)
      .then((result: number) => {
         console.log('Yielded', result);
         app.close();
         console.log('Closed app context');
      })
      .catch((err: any) => {
         console.error('Trapped error!', err);
         app.close();
         console.log('Closed app context');
      });

   console.log(resourceSemaphore.name);
}

bootstrap()
   .then(() => {
      console.log('Bootstrap completed!')
   })
   .catch((err: any) => {
      console.error('Bootstrap failed!', err);
   });
console.log('Returned from async bootstrap.');

/*
let counter = 0;
setInterval(() => {
   counter++;
   // console.log('Wooga wooga', ++counter);
}, 15000);
*/