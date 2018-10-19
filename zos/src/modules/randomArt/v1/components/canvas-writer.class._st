import {OperatorFunction} from 'rxjs';
import {map} from 'rxjs/operators';
import {Canvas} from 'canvas';
import * as path from 'path';
import * as fs from 'fs';

import {WriteToFileContext} from '../interfaces/index';

export class CanvasWriter
{
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

   constructor(private readonly outputDir: string)
   {
      if (!this.outputDir.endsWith('/')) {
         this.outputDir = this.outputDir + '/';
      }
      CanvasWriter.ensureDirectory(this.outputDir);
   }

   private ensurePath(filePath: string): string
   {
      if (filePath.startsWith('/', 0)) {
         throw Error('Derived file path, ' + filePath + ', may not be absolute');
      }
      if (filePath.length <= 0) {
         throw Error('Derived file path may not be blank');
      }
      if (filePath.endsWith('/')) {
         throw Error('Derived file path, ' + filePath + ', may not specify a directory');
      }
      if (!filePath.endsWith('.png')) {
         filePath = filePath + '.png';
      }
      if (fs.existsSync(filePath)) {
         throw Error('Derived file path, ' + filePath + ', already exists');
      }
      filePath = path.join(this.outputDir, filePath);

      const dirPath = path.dirname(filePath);
      if (!dirPath.startsWith(this.outputDir)) {
         throw Error('Derived file path, ' + filePath + ', may not traverse above root with ..');
      }
      CanvasWriter.ensureDirectory(dirPath);

      return filePath;
   }

   public writeOutputFile(): OperatorFunction<WriteToFileContext, Promise<Canvas>>
   {
      return map((taskContext: WriteToFileContext): Promise<Canvas> => {
         const filePath = this.ensurePath(taskContext.outputFilePath);
         console.log(`Entered stream writer for ${filePath}`);

         try {
            const out = fs.createWriteStream(filePath);
            const stream = taskContext.canvas.createPNGStream();

            return new Promise((resolve, reject) => {
               // stream.on('data', function (chunk: any) {
               //    out.write(chunk);
               // });
               //
               // stream.on('end', () => {
               //    console.log('Saved png to ', filePath, out.bytesWritten);
               //    out.end(() => {
               //       resolve(taskContext.canvas);
               //    });
               // });
               //
               // stream.on('error', function (err: any) {
               //    console.error('Brap!', err);
               //    reject(err);
               //    out.close();
               // });
               out.on('end', () => {
                  console.log(`Saved png of ${out.bytesWritten} bytes to ${filePath}`);
                  resolve(taskContext.canvas);
               });

               stream.on('error', function (err: any) {
                  console.error('Brap!', err);
                  reject(err);
                  out.close();
               });

               stream.pipe(out);
            });
         } catch (err) {
            return Promise.reject(
               new Error(`I/O error while attempting to output to ${filePath}: ${err}`)
            );
         }
      });
   }
}
