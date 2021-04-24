import 'reflect-metadata';
import * as cluster from 'cluster';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { LeaderApplicationModule } from './leader/leader-application.module';
import { LeaderApplication } from './leader/leader-application.class';
import { FollowerAppModule } from './follower/di/follower-app.module';
import { FollowerApplication } from './follower/components/follower-application.service';
import { FollowerAutoDriver } from './follower/components/follower-auto-driver.service';

async function bootstrap()
{
   // TODO: Use separate try catch blocks for Context setup, main program execution, and Context
   //       teardown so we may attempt to close out the Context if we every lang in the main
   //       program's error handler.
   try {
      console.log('Process bootstrapping');
      if (cluster.isMaster) {
         console.log('Leader bootstrapping');

         const ctx =
            await NestFactory.createMicroservice(LeaderApplicationModule, {
               transport: Transport.GRPC,
               options: {
                  package: 'name.jchein.portfolio.services.randomArt.paintGateway.grpc.proto',
                  protoPath: require.resolve('@jchgrpc/paint.gateway-node/proto.proto')
               }
            });
         console.log('Leader context loaded');

         ctx.useGlobalPipes(new ValidationPipe());
         const mainApp = ctx.get(LeaderApplication);
         console.log('Launching leader main program...');

         const lifecyclePromise = mainApp.start();
         console.log('Leader has been launched');

         await lifecyclePromise;
         console.log('Application lifecycle has completed normally.  Shutting down.');

         await ctx.close();
      } else if (cluster.isWorker) {
         console.log('Follower bootstrapping');

         const ctx = await NestFactory.createApplicationContext(FollowerAppModule);
         console.log('Follower context loaded');

         const mainApp = ctx.get(FollowerApplication);
         const autoDriver = ctx.get(FollowerAutoDriver);
         console.log('Launching follower main program...');

         // Ramp up...
         const lifecyclePromise = mainApp.start();
         console.log('Follower has asynchronously started its application');
         const driverWorkloadPromise = autoDriver.start();
         console.log('Follower has asynchronously begun driving a workload');

         // Wait to ramp down...
         await driverWorkloadPromise;
         console.log('Workload driver has completed normally.');
         await lifecyclePromise;
         console.log('Application lifecycle has completed normally.  Shutting down.');

         await ctx.close();
      }

      console.log('Closed application context. Process exiting gracefully...');
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
