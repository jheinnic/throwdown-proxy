import {Observable} from 'rxjs';

import {TaskContentGenerator} from './task-content-generator.interface';
import {TaskContentAdapter} from '../interfaces/task-content-adapter.interface';
import {ImageDimensions} from '../interfaces/image-dimensions.value';
import * as path from 'path';
import * as crypto from 'crypto';
import * as process from 'process';
import rl = require('readline');

export class IntArrayToken
{
  constructor(
    public readonly tokenArray: Array<number>,
    public readonly tokenString: string)
  { }

  static fromBuffer(buffer: Buffer): IntArrayToken
  {
    const tokenLength = buffer.byteLength;
    const tokenArray = new Array(tokenLength);
    for (
      let ii = 0; ii < tokenLength; ii++)
    {
      tokenArray[ii] = buffer.readUInt8(ii);
    }
    const tokenString = (
      buffer as any
    ).hexSlice();

    return new IntArrayToken(tokenArray, tokenString);
  }

  reduced(): IntArrayToken {
    const reducedArray = this.tokenArray.map( function(original) {
      return original % 256;
    });

    return new IntArrayToken(reducedArray, 'R#' + this.tokenString);
  }

  halved(): IntArrayToken {
    const reducedArray = this.tokenArray.slice(0, this.tokenArray.length / 4);

    return new IntArrayToken(reducedArray, 'H#' + this.tokenString);
  }
}

export class IntArrayModel
{
  constructor(
    public readonly prefix: IntArrayToken,
    public readonly suffix: IntArrayToken,
    public readonly novel: boolean,
    public readonly generation: number)
  {
  }
}

export interface IntArrayModelGenConfig
{
  prefixCount: number;
  prefixLength: number;
  suffixCount: number;
  suffixLength: number;
  termRange: number;
  firstGeneration?: number;
}

export class IntArrayModelAdapter extends TaskContentAdapter<IntArrayModel>
{
  private readonly dimensionDir: string;

  constructor(public readonly imageDimensions: ImageDimensions)
  {
    super(imageDimensions);
    this.dimensionDir =
      `${imageDimensions.pixelWidth.toString()}x${imageDimensions.pixelHeight.toString()}`;
  }

  public convertToModelString(sourceContent: IntArrayModel): [number[], number[]]
  {
    return [sourceContent.prefix.tokenArray, sourceContent.suffix.tokenArray];
  }

  public convertToImagePath(sourceContent: IntArrayModel): string
  {
    return path.join(
      this.dimensionDir,
      sourceContent.generation.toString() + (sourceContent.novel ? '-New' : '-Orig'),
      `${
        sourceContent.prefix.tokenString.slice(0, 32)
      }/${
        sourceContent.suffix.tokenString.slice(0, 32)
      }.png`
    );
  }

  public isNovelStrategy(sourceContent: IntArrayModel): boolean
  {
    return sourceContent.novel;
  }
}



/*
i.question('What do you think of node.js?', function(answer) {
  console.log('Thank you for your valuable feedback.');

  // These two lines together allow the program to terminate. Without
  // them, it would run forever.
  i.close();
  process.stdin.end();
});
*/

/*
export class IntArrayConsoleGenerator extends TaskContentGenerator<IntArrayModel>
{
  constructor(public readonly genConfig: IntArrayModelGenConfig)
  {

  }

  public allocateIterator(): IterableIterator<IntArrayModel>
  {
    return consoleGenerator(this.genConfig);
  }
}



  function* consoleGenerator(
  genConfig: IntArrayModelGenConfig): IterableIterator<IntArrayModel>
{
   const i = rl.createInterface(process.stdin, process.stdout, null);
   const observeLineFn = Observable.bindCallback<string, string>(i.question);
   const sourceOfLines = Observable.defer( () => observeLineFn('next?'));

   sourceOfLines.subscribe(
     (line: string) => {
        yield new IntArrayModel(
          prefix,
          suffix,
          true,
        );
     }
   );
}

*/
export class IntArrayModelGenerator extends TaskContentGenerator<IntArrayModel>
{
  constructor(public readonly genConfig: IntArrayModelGenConfig)
  {
    super();
  }

  public allocateIterator(): IterableIterator<IntArrayModel>
  {
    return taskGenerator(this.genConfig);
  }
}


function* taskGenerator(
  genConfig: IntArrayModelGenConfig): IterableIterator<IntArrayModel>
{
  function createIntArrayParts(partCount: number, partLength: number): Array<IntArrayToken>
  {
    const retVal = new Array(partCount);
    for (let ii = 0; ii < partCount; ii++) {
      retVal[ii] = IntArrayToken.fromBuffer(crypto.randomBytes(partLength));
    }

    return retVal;
  }

  function reduce(source: Array<IntArrayToken>): Array<IntArrayToken> {
    const retVal = new Array(source.length * 4);

    for (let ii = 0, jj = 0; ii < source.length; ii++, jj = jj + 4) {
      retVal[jj] = source[ii];
      retVal[jj + 1] = source[ii].reduced();
      retVal[jj + 2] = source[ii].halved();
      retVal[jj + 3] = retVal[jj + 1].halved();
    }

    return retVal;
  }

  let generation = !!genConfig.firstGeneration ? genConfig.firstGeneration : 1;
  while (true) {
    const prefixes: Array<IntArrayToken> =
      createIntArrayParts(genConfig.prefixCount, genConfig.prefixLength);
    const suffixes: Array<IntArrayToken> =
      createIntArrayParts(genConfig.suffixCount, genConfig.suffixLength);

    // prefixes = reduce(prefixes);
    // suffixes = reduce(suffixes);

    console.log('Next batch of names have given=', prefixes, '; family=', suffixes);

    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        yield new IntArrayModel(
          prefix,
          suffix,
          true,
          generation
        );
        yield new IntArrayModel(
          prefix,
          suffix,
          false,
          generation
        );
      }
    }

    generation = generation + 1;
  }
}

