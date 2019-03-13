import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Worker } from 'cluster';

import { ApplicationModule } from './application.module';
import { CANVAS_SEMAPHORE_PROVIDER_TOKEN } from './application.constants';
import { simulateWorkload } from './simulate-workload.function';
import { IResourceSemaphore } from '@jchptf/semaphore';

async function bootstrap()
{
   console.log('Starting app context');
   const app = await NestFactory.createApplicationContext(ApplicationModule);
   console.log('Awaited app context');

   const resourceSemaphore = app.get<IResourceSemaphore<Worker>>(CANVAS_SEMAPHORE_PROVIDER_TOKEN);
   // const acquireChan = app.get(APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER);
   // const recycleChan = app.get(APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER);

   console.log(resourceSemaphore);

   // logic...
   simulateWorkload(resourceSemaphore)
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