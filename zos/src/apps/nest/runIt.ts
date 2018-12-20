import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './application.module';
import {getResourceSemaphoreToken} from '../../infrastructure/lib/semaphore/di/resource-semaphore.token-factory';
import '@jchptf/reflection'

async function bootstrap1()
{
   const app = await NestFactory.createApplicationContext(ApplicationModule);
   const resourceSemaphore = app.get(getResourceSemaphoreToken("FourSquare"));
   console.log(resourceSemaphore.name);
   // logic...
}
async function bootstrap2()
{
   const app2 = await NestFactory.create(ApplicationModule);
   const resourceSemaphore2 = app2.get(getResourceSemaphoreToken("FourSquare"));
   console.log(resourceSemaphore2.name);
   // logic...
}
bootstrap1();
bootstrap2();

// const tasksController = app.select(TasksModule).get(TasksController, { strict: true });
