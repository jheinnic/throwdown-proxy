import * as crypto from 'crypto';
import * as util from 'util';
import * as path from 'path';
// import * as fs from 'fs';

import { CloudinaryV2, UploadOptions, UploadResult } from 'cloudinary';
import { Inject, Injectable } from '@nestjs/common';
import { BitInputStream } from '@thi.ng/bitstream';
import { Transform } from 'stream';
import { Canvas } from 'canvas';

import { IAdapter } from '@jchptf/api';

import { ICanvasStoragePolicy, IModelSeed } from '../interface';
import { Path, UUID } from 'infrastructure/validation';
import { CloudinaryCredentials } from '../config/cloudinary-credentials.config';
import { SeedToDirPath } from '../config/seed-to-dir-path.config';
import { CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN } from '../follower-application.constants';

@Injectable()
export class CloudinaryCanvasWriter implements ICanvasStoragePolicy
{
   private readonly bitsPerTier: number[];

   // private shutdownRequested: boolean = false;
   // private gracefullyShutdown: boolean = false;

   constructor(
      credentials: CloudinaryCredentials,
      private readonly seedToPath: SeedToDirPath,
      @Inject(CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN)
      private readonly cloudinary: CloudinaryV2)
   {
      // TODO: Cloudinary client should be injected pre-authenticated.
      this.cloudinary.config({
         cloud_name: credentials.cloud_name,
         api_key: credentials.api_key,
         api_secret: credentials.api_secret
      });

      const bitsPerTierStr: string[] = seedToPath.bitsPerTier.split(':');
      this.bitsPerTier = new Array<number>(bitsPerTierStr.length);
      for (let ii = 0; ii < bitsPerTierStr.length; ii += 1) {
         this.bitsPerTier[ii] = parseInt(bitsPerTierStr[ii]);
      }
   }

   public async store(
      uuid: UUID, modelSeed: IModelSeed,
      fileName: Path, canvasAdapter: IAdapter<Canvas>
   ): Promise<UUID>
   {
      const hashStream = crypto.createHash(this.seedToPath.hashAlgorithm);
      hashStream.update(modelSeed.prefixBits);
      hashStream.update(modelSeed.suffixBits);
      const hashBuffer = hashStream.digest();
      const reader = new BitInputStream(hashBuffer);
      const filePath = path.join(
         this.seedToPath.dirRoot,
         ...reader.readFields(this.bitsPerTier).map(
            (value: Buffer) => value.toString('hex')),
         `${fileName}.png`
      ) as Path;

      return this.doStore(uuid, filePath, canvasAdapter.unwrap());
   }

   private async doStore(uuid: UUID, filePath: Path, canvas: Canvas): Promise<UUID>
   {
      console.log(`Saving ${filePath}...`);

      // TODO: Get the Cloudinary Client here by Semaphore instead, and use that
      //       in lieu of having an injected ILimiter.
      return await new Promise<UUID>(
         (resolve, reject) => {
            const stream = canvas.createPNGStream();
            const options: UploadOptions = {
               public_id: filePath
            };
            const out: Transform = this.cloudinary.uploader.upload_stream(
               (err: any, result: UploadResult): void => {
                  if (!! err) {
                     console.error(err)
                  } else {
                     console.log(result);
                  }
               }, options
            );
            // const out = fs.createWriteStream(
            //    path.join(this.outputDir, filePath)
            // );

            out.on('close', () => {
               console.warn(JSON.stringify(out));
               console.warn(util.inspect(out, true, 8, true));
               console.log(`Saved bytes to ${filePath}`);

               resolve(uuid);
            });

            // stream.on('end', () => {
            //    console.log(`Alt saved png of ${out.bytesWritten} bytes to ${filePath}`);
            //    resolve(uuid);
            // })

            out.on('error', function (err: any) {
               console.error('Brap from writeStream!', err);
               reject(err);
               // out.close();
            });

            stream.on('error', function (err: any) {
               console.error('Brap from pngStream!', err);
               reject(err);
               // out.close();
            });

            stream.pipe(out);
         }
      );
   }
}
