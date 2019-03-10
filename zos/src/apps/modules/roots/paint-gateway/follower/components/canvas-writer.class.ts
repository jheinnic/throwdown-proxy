import { Canvas } from 'canvas';
import * as path from 'path';
import * as fs from 'fs';

import { ICanvasStoragePolicy } from '../interface';
import { IDirectoryUtils } from '../../../../../../infrastructure/lib/directory-utils.interface';
import { Path, UUID } from '../../../../../../infrastructure/validation';
import { Limiter } from '@jchptf/coroutines';

export class CanvasWriter implements ICanvasStoragePolicy
{
   /*
   private static ensureDirectory(dirPath: string)
   {
      if (fs.existsSync(dirPath)) {
         let isDirectory = false;
         try {
            const stats = fs.statSync(dirPath);
            isDirectory = stats.isDirectory();
         } catch (err) {
            throw Error(dirPath + ' is not an accessible directory: ' + err);
         }

         if (!isDirectory) {
            throw Error(dirPath + ' exists, but is not a directory');
         }
      } else {
         try {
            CanvasWriter.ensureDirectory(path.dirname(dirPath));
            fs.mkdirSync(dirPath);
         } catch (err) {
            throw Error(dirPath + ' did not exist and could not be created: ' + err);
         }
      }
   }
   */

   private readonly directoryCheck: Promise<string>;
   private readonly writeOutputFile:
      (uuid: UUID, filePath: Path, canvas: Canvas) => Promise<UUID>;

   constructor(
      private readonly outputDir: string,
      private readonly dirUtils: IDirectoryUtils,
      private readonly limiter: Limiter,
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

   public async store(uuid: UUID, filePath: Path, canvas: Canvas): Promise<UUID>
   {
      return this.writeOutputFile(uuid, filePath, canvas);
   }

   private async doStore(uuid: UUID, filePath: Path, canvas: Canvas): Promise<UUID>
   {
      console.log(`Saving ${filePath}...`);

      await this.directoryCheck;

      return await new Promise<UUID>(
         (resolve, reject) => {
            const stream = canvas.createPNGStream();
            const out = fs.createWriteStream(
               path.join(this.outputDir, filePath)
            );

            out.on('end', () => {
               console.log(`Saved png of ${out.bytesWritten} bytes to ${filePath}`);
               resolve(uuid);
            });

            stream.on('error', function (err: any) {
               console.error('Brap!', err);
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
