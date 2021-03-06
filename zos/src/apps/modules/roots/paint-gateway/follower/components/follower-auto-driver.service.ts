import 'reflect-metadata';
import uuid = require('uuid');
import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

import { Name, UUID } from 'infrastructure/validation';
import { TrigramModelSeedStrategy } from '../../../../../../modules/tickets/components/modelSeed';
import { AbstractAsyncModelSeedStrategy } from "../../../../../../modules/tickets/components/modelSeed/abstract-async-model-seed.strategy.class";
import { FollowerApplication } from './follower-application.service';
import { BitStrategyKind } from '../../../../../../modules/tickets/config/bit-strategy-kind.enum';
import { PrefixSelectStyle } from '../../../../../../modules/tickets/config/prefix-select-style.enum';

@Injectable()
export class FollowerAutoDriver
{
   private seedStrategy: AbstractAsyncModelSeedStrategy;

   constructor(private readonly mainApp: FollowerApplication)
   {
      const seedVariant = {
         name: 'seedName' as Name,
         bitMode: BitStrategyKind.trigrams,
         prefixSelect: PrefixSelectStyle.USE_X,
         xRunsForward: true,
         yRunsForward: true,
         xFromBit: 0,
         xToBit: 127,
         yFromBit: 0,
         yToBit: 127,
         useNewModel: false
      };

      this.seedStrategy =
         new TrigramModelSeedStrategy(seedVariant); //this.seedVariant);
   }

   async start(): Promise<void>
   {
      console.log('Process starting');
      const renderPolicy = uuid.v4()
         .toString() as UUID;
      const storagePolicy = uuid.v4()
         .toString() as UUID;
      // let iter = 1;

      try {
         while (true) {
            let prefixes: Buffer[] = [
               randomBytes(18),
               randomBytes(18),
               randomBytes(18)
            ];
            let suffixes: Buffer[] = [
               randomBytes(18),
               randomBytes(18),
               randomBytes(18)
            ];

            // const loopPfx = sprintf('%03d', iter);
            for (let ii = 0; ii < 3; ii += 1) {
               const prefix = prefixes[ii];
               for (let jj = 0; jj < 3; jj += 1) {
                  const suffix = suffixes[jj];

                  const modelSeed = await this.seedStrategy.extractSeed(prefix, suffix);
                  // const firstName =
                  //    Buffer.from(modelSeed.prefixBits)
                  //       .toString('ascii');
                  // const lastName =
                  //    Buffer.from(modelSeed.suffixBits)
                  //       .toString('ascii');
                  // const fileName = `${loopPfx}-${firstName}_${lastName}.png`;

                  const taskId = await this.mainApp.submitTask(
                     modelSeed, renderPolicy, storagePolicy
                  );

                  console.log(`Submitted ${await taskId}`);
               }
            }

            // iter += 1;
         }
      } catch (err) {
         console.error('Closed follower context abnormally!  Exiting...', err);
         throw err;
      }
   }
}

