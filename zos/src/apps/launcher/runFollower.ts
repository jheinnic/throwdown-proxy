import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { sprintf } from 'sprintf-js';
import uuid = require('uuid');
import { randomBytes } from 'crypto';

import { FollowerApplicationModule } from '../modules/roots/paint-gateway/follower/follower-application.module';
import { FollowerApplication } from '../modules/roots/paint-gateway/follower/follower-application.service';
import { TrigramModelSeedStrategy } from '../../modules/tickets/components/modelSeed';
import { BitStrategyKind, PrefixSelectStyle } from '../../modules/tickets/config';
import { Name, Path, UUID } from 'infrastructure/validation';
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

async function driveWorkload(mainApp: FollowerApplication): Promise<void>
{
   try {
      const renderPolicy = uuid.v4().toString() as UUID;
      const storagePolicy = uuid.v4().toString() as UUID;
      let iter = 1;
      while (true) {
         let prefixes: Buffer[] = [
            randomBytes(9),
            randomBytes(9),
            randomBytes(9)
         ];
         let suffixes: Buffer[] = [
            randomBytes(9),
            randomBytes(9),
            randomBytes(9)
         ];

         // @ts-ignore
         const loopPfx = sprintf("%03d", iter);
         for (let ii = 0; ii < 3; ii += 1) {
            const prefix = prefixes[ii];
            for (let jj = 0; jj < 3; jj += 1) {
               const suffix = suffixes[jj];

               const modelSeed = await strategy.extractSeed(prefix, suffix);
               const firstName = Buffer.from(modelSeed.prefixBits).toString('ascii');
               const lastName = Buffer.from(modelSeed.suffixBits).toString('ascii');
               const fileName = `${loopPfx}-${firstName}_${lastName}.png`;

               const taskId = await mainApp.submitTask(
                  modelSeed, fileName as Path, renderPolicy, storagePolicy
               );

               console.log(`Submitted ${await taskId}`);
            }
         }

         iter += 1;
      }
      console.log('Closed follower context normally.  Exiting...');
   } catch (err) {
      console.error('Closed follower context abnormally!  Exiting...', err);
      throw err;
   }
}

const seedVariant = {
   name: 'seedName' as Name,
   nameExtension: '64toA_yRx_128bit',
   bitMode: BitStrategyKind.trigrams,
   prefixSelect: PrefixSelectStyle.USE_X,
   xRunsForward: true,
   yRunsForward: true,
   xFromBit: 0,
   xToBit: 71,
   yFromBit: 0,
   yToBit: 71,
   useNewModel: false
};
const strategy =
   new TrigramModelSeedStrategy(seedVariant);

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
