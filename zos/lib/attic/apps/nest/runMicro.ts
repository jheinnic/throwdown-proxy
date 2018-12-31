import 'reflect-metadata';
import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './application.module';
import {Transport} from '@nestjs/microservices';
import * as path from 'path';

import {
   APPLICATION_CANVAS_SEMAPHORE_PROVIDER,
   APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER,
   APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER
} from './application.constants';
import {simulateWorkload} from './simulate-workload.function';

async function bootstrap()
{
   console.log('App starting');
   const app = await NestFactory.createMicroservice(ApplicationModule, {
      transport: Transport.GRPC,
      options: {
         package: 'name.jchein.portfolio.randomArt.services.paintQueue.grpc.proto',
         protoPath: path.join(__dirname, 'protos/proto.proto')
      }
   });
   console.log('App started');

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

   console.log('Micro:', resourceSemaphore.name);
}

bootstrap()
   .then(() => {
      console.log('Bootstrap completed!')
   })
   .catch((err: any) => {
      console.error('Bootstrap failed!', err);
   });
console.log('Returned from async bootstrap.');
