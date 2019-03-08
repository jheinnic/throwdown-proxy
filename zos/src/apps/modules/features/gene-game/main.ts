import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './di/application.module';

async function bootstrap() {
   const app = await NestFactory.create(ApplicationModule);
   app.useGlobalPipes(new ValidationPipe());
   await app.listen(3000);
}

bootstrap().then(
   () => { console.log('Application returned a controlled shutdown'); },
   (err: any) => {
      console.log('Application shutdown with an error return status', err);
   },
);