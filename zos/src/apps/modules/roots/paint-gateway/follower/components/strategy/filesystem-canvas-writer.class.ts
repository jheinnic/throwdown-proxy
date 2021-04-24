import { Canvas } from 'canvas';
import * as path from 'path';
import * as fs from 'fs';

import { ILimiter } from '@jchptf/coroutines';

import { IArtworkSeed } from '../interface';
import { IDirectoryUtils } from '../../../../../../infrastructure/lib/directory-utils.interface';
import { Path, UUID } from '../../../../../../infrastructure/validation';

export class CanvasWriter implements ICanvasStoragePolicy
{
   private readonly directoryCheck: Promise<string>;
   private readonly writeOutputFile:
      (uuid: UUID, filePath: Path, canvas: Canvas) => Promise<UUID>;

   constructor(
      private readonly outputDir: string,
      private readonly dirUtils: IDirectoryUtils,
      private readonly limiter: ILimiter,
      private readonly requirePrivacy: boolean = false)
   {
      if (!this.outputDir.endsWith('/')) {
         this.outputDir = this.outputDir + '/';
      }
      if (this.requirePrivacy) {
         this.directoryCheck =
            this.dirUtils.ensurePrivateDir(this.outputDir);
      } else {
         this.directoryCheck =
            this.dirUtils.ensureWritableDir(this.outputDir);
      }

      this.writeOutputFile = this.limiter(this.doStore.bind(this));
   }

   public async store(
      uuid: UUID,
      _modelSeed: IArtworkSeed,
      filePath: Path,
      canvasAdapter: Canvas): Promise<UUID>
   {
      return this.writeOutputFile(uuid, filePath, canvasAdapter);
   }

   private async doStore(uuid: UUID, filePath: Path, canvas: Canvas): Promise<UUID>
   {
      await this.directoryCheck;

      console.log(`Saving ${filePath}...`);

      return await new Promise<UUID>(
         (resolve, reject) => {
            const stream = canvas.createPNGStream();
            const out = fs.createWriteStream(
               path.join(this.outputDir, filePath)
            );

            out.on('close', () => {
               console.log(`Saved ${out.bytesWritten} bytes to ${filePath}`);
               resolve(uuid);
            });

            // stream.on('end', () => {
            //    console.log(`Alt saved png of ${out.bytesWritten} bytes to ${filePath}`);
            //    resolve(uuid);
            // })

            out.on('error', function (err: any) {
               console.error('Brap from writeStream!', err);
               reject(err);
               out.close();
            });

            stream.on('error', function (err: any) {
               console.error('Brap from pngStream!', err);
               reject(err);
               out.close();
            });

            stream.pipe(out);
         }
      );
      // } catch (err) {
      //    return Promise.reject(
      //       new Error(`I/O error while attempting to output to ${filePath}: ${err}`)
      //    );
      // }
      // });
   }
}
