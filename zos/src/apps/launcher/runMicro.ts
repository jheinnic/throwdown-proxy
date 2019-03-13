import 'reflect-metadata';
import {NestFactory} from '@nestjs/core';
import {Transport} from '@nestjs/microservices';
import * as cluster from 'cluster';

import { LeaderApplicationModule } from '../modules/roots/paint-gateway/leader/leader-application.module';
import { LeaderApplication } from '../modules/roots/paint-gateway/leader/leader-application.class';
import { FollowerApplicationModule } from '../modules/roots/paint-gateway/follower/follower-application.module';
import { FollowerApplication } from '../modules/roots/paint-gateway/follower/follower-application.service';

async function bootstrap()
{
   try {
      console.log('Process starting');
      if (cluster.isMaster) {
         console.log('Leader starting');
         const ctx = await NestFactory.createMicroservice(LeaderApplicationModule, {
            transport: Transport.GRPC,
            options: {
               package: 'name.jchein.portfolio.services.randomArt.paintGateway.grpc.proto',
               protoPath: require.resolve('@jchgrpc/paint.gateway-node/proto.proto')
            }
         });
         console.log('Leader started');
         const mainApp = ctx.get(LeaderApplication);
         console.log('Yielded', await mainApp.run());

         ctx.close();
         console.log('Closed app context');
      } else if (cluster.isWorker) {
         console.log('Follower starting');
         const ctx = await NestFactory.createApplicationContext(FollowerApplicationModule);
         console.log('Follower context loaded');
         const mainApp = ctx.get(FollowerApplication);
         console.log('Follower application', mainApp);
         console.log('Yielded', await mainApp.run());

         ctx.close();
         console.log('Closed follower context');
      }
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
