import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

import { FollowerApplicationModule } from '../modules/roots/paint-gateway/follower/follower-application.module';
import { FollowerApplication } from '../modules/roots/paint-gateway/follower/follower-application.service';
import { FollowerAutoDriver } from '../modules/roots/paint-gateway/follower/experiment/follower-auto-driver.service';

async function bootstrap()
{
   try {
      console.log('Process starting');
      console.log('Follower starting');
      const ctx = await NestFactory.createApplicationContext(
         FollowerApplicationModule);
      console.log('Follower context loaded');
      const mainApp = ctx.get(FollowerApplication);
      const autoDriver = ctx.get(FollowerAutoDriver);

      // Ramp up...
      const lifecyclePromise = mainApp.start();
      console.log('Follower has asynchronously started its application');
      // const driverWorkloadPromise = driveWorkload(mainApp);
      const driverWorkloadPromise = autoDriver.start();
      console.log('Follower has asynchronously begun driving a workload');

      // Wait to ramp down...
      await driverWorkloadPromise;
      console.log('Workload driver has completed normally.');
      await lifecyclePromise;
      console.log('Application lifecycle has completed normally.');
      await ctx.close();
      console.log('Closed follower NestContext normally.  Exiting...');
   } catch (err) {
      console.error('Closed follower context abnormally!  Exiting...', err);
      throw err;
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
