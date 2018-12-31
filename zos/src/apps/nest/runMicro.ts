import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './application.module';
import {getResourceSemaphoreToken} from '../../infrastructure/lib/semaphore/di/resource-semaphore.token-factory';
import '@jchptf/reflection'
import {Transport} from '@nestjs/microservices';
import * as path from 'path';

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
   const resourceSemaphore = app.get(getResourceSemaphoreToken("FourSquare"));
   console.log('Micro:', resourceSemaphore.name);
   // logic...
}
bootstrap();

