import * as util from 'util';
import * as path from 'path';
// import * as fs from 'fs';

import { CloudinaryV2, UploadOptions, UploadResult } from 'cloudinary';
import { Inject, Injectable } from '@nestjs/common';
import { Transform } from 'stream';
import { Canvas } from 'canvas';

import { Path } from 'infrastructure/validation';
import { ICanvasStorageStrategy } from '../../interface/strategy';
import { ICloudinaryWriterConfig } from '../../interface/model/deployed';
import {
   CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN, CLOUDINARY_WRITER_CONFIG_PROVIDER_TOKEN
} from '../../../../../shared/cloudinary/cloudinary.constants';

@Injectable()
export class CloudinaryCanvasWriter implements ICanvasStorageStrategy
{
   // private readonly bitsPerTier: ReadonlyArray<number>;
   // private shutdownRequested: boolean = false;
   // private gracefullyShutdown: boolean = false;

   constructor(
      @Inject(CLOUDINARY_WRITER_CONFIG_PROVIDER_TOKEN)
      private readonly writerConfig: ICloudinaryWriterConfig,
      @Inject(CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN)
      private readonly cloudinary: CloudinaryV2)
   {
      // TODO: Cloudinary client should be injected pre-authenticated.
      // this.cloudinary.config({
      //    cloud_name: writerConfig.cloudName,
      //    api_key: writerConfig.apiKey,
      //    api_secret: writerConfig.apiSecret
      // });

      // this.pathToRoot = writerConfig.pathToRoot;
  }

   public async saveCanvas(filePath: Path, canvas: Canvas): Promise<boolean>
   {
     // Note: this.bitsPerTier is required by @thi.ng/BitInputSteam to not be readonly,
      //       Although it does not modify the input, we still have to deal with a clone of
      //       the original input because of this call signature mishap.
      const fullFilePath = path.join( this.writerConfig.pathToRoot, filePath ) as Path;

      // this.doStore(filePath, canvas);
      console.log(`Saving ${filePath}...`);

      // TODO: Get the Cloudinary Client here by Semaphore instead, and use that
      //       in lieu of having an injected ILimiter.
      return new Promise<boolean>(
         (resolve, reject) => {
            const stream = canvas.createPNGStream();
            const options: UploadOptions = {
               public_id: filePath,
               rbg: true,
               ...this.writerConfig,
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
               console.log(`onClose of ${fullFilePath}`);

               resolve(true);
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
