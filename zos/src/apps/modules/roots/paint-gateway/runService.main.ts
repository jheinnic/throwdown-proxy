import 'reflect-metadata';
import * as cluster from 'cluster';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { LeaderApplicationModule } from './leader/leader-application.module';
import { LeaderApplication } from './leader/leader-application.class';
import { FollowerApplicationModule } from './follower/follower-application.module';
import { FollowerApplication } from './follower/follower-application.service';
import { FollowerAutoDriver } from './follower/experiment/follower-auto-driver.service';

async function bootstrap()
{
   try {
      console.log('Process starting');
      if (cluster.isMaster) {
         console.log('Leader starting');
         const ctx =
            await NestFactory.createMicroservice(LeaderApplicationModule, {
               transport: Transport.GRPC,
               options: {
                  package: 'name.jchein.portfolio.services.randomArt.paintGateway.grpc.proto',
                  protoPath: require.resolve('@jchgrpc/paint.gateway-node/proto.proto')
               }
            });
         ctx.useGlobalPipes(new ValidationPipe());
         console.log('Leader started');

         const mainApp = ctx.get(LeaderApplication);
         console.log('Yielded', await mainApp.start());

         ctx.close();
         console.log('Closed app context');
      } else if (cluster.isWorker) {
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
      }
      console.log('Process exiting gracefully...');
   } catch (err) {
      console.error('Process exiting abnormally on trapped error!', err);
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
