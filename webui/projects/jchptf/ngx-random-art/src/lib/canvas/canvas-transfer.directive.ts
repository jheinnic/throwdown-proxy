import {Canvas} from 'canvas';
import * as path from 'path';
import * as fs from 'fs';
import {Directive, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Channel} from '@thi.ng/csp';
import {CloudinaryTransformationDirective} from '@cloudinary/angular-5.x';

@Directive({
  selector: '[ngx-ra-transfer]',
})
export class CanvasTransfer
{
  constructor(private readonly store: Store<any>) {
    CloudinaryTransformationDirective
  }

  @Input() public inputChannel: Channel<string>;

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
    // filePath = path.join(this.outputDir, filePath);
    //
    // const dirPath = path.dirname(filePath);
    // if (!dirPath.startsWith(this.outputDir)) {
    //   throw Error('Derived file path, ' + filePath + ', may not traverse above root with ..');
    // }
    // CanvasWriter.ensureDirectory(dirPath);

    return filePath;
  }

  public writeOutputFile(taskContext: FileWriterTaskContext): Promise<Canvas>
  {
    const filePath = this.ensurePath(taskContext.outputFilePath);
    console.log('Entered stream writer for ' + filePath);

    try {
      const out = fs.createWriteStream(filePath);
      const stream = taskContext.canvas.createPNGStream();

      return new Promise((resolve, reject) => {
        // stream.pipe(out);

        stream.on('data', function (chunk: any) {
          out.write(chunk);
        });

        stream.on('end', () => {
          console.log('Saved png to ', filePath, out.bytesWritten);
          out.end(() => {
            resolve(taskContext.canvas);
          });
        });

        stream.on('error', function (err: any) {
          console.error('Brap!', err);
          reject(err);
          out.close();
        });
      });
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(Error('I/O error while attempting to output to ' + filePath + ': ' + err));
      });
    }
  }
}

