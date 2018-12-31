import {Deployment} from '../../../../apps/config/index';
import {Chan, go, put} from 'medium';
import * as util from 'util';
import * as fs from 'fs';
import {EllipticModelGenConfig} from './config/elliptic-model-gen-config.value';
import {EllipticPublicKeySource} from './elliptic-public-key-model-factory.class';
import * as path from "path";

export class PublicKeyReadAheadProcess
{
   constructor(
      public readonly genConfig: EllipticModelGenConfig,
      private readonly deployConfig: Deployment,
      private readonly channel: Chan<EllipticPublicKeySource>)
   { }

   start(): void {
      go(this.readAheadPublicKeys.bind(this)).then(
         (): void => {
            console.log('Returning from read-ahead component');
            return;
         }
      ).catch(
         (err: any) => {
            console.error('Error running thread read-ahead.  What now??', err);
         }
      );
   }

   public async readAheadPublicKeys()
   {
      let generation = !!this.genConfig.firstGeneration ? this.genConfig.firstGeneration : 1;

      for (let lotOfData of this.genConfig.pathIterTwo) {
         const keyBuffer: Buffer =
            await util.promisify(fs.readFile)(
               toPublicKeyFile(this.genConfig, this.deployConfig, lotOfData.name),
               { flag: 'r' }
            );
         const keySource: EllipticPublicKeySource =
            EllipticPublicKeySource.fromBuffer(
               keyBuffer, lotOfData.name, generation, this.genConfig);
         await put(this.channel, keySource);
         // console.log(`Put ${keySource.sourcePath} on channel`);
      }
   }
}

function toPublicKeyFile(genModel: EllipticModelGenConfig, deployCfg: Deployment, pathName: string): string
{
   return path.join(
      genModel.outputRoot,
      deployCfg.dataSetPaths.ticketKeyPairs,
      pathName + '_public.key');
}