import * as crypto from "crypto";
import {TaskContentGenerator} from '../../../../../../migration/randomArt/task-content-generator.interface';
import {IntArrayModel, IntArrayModelGenConfig, IntArrayToken} from '../../../../../../migration/randomArt/hash-model-adapter.class';

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
