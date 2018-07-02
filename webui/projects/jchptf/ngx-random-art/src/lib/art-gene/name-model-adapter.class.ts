import {TaskContentAdapter} from './task-content-adapter.interface';
import {ImageDimensions} from './image-dimensions.interface';
import * as path from 'path';

export interface NameModel
{
  readonly firstName: Array<string>;
  readonly lastName: string;
  readonly generation: number;
}

export interface NameModelGenConfig
{
  givenNameCount: number;
  givenNameWords: number;
  familyNameCount: number;
  middleNameCount: number;
  firstGeneration?: number;
}

export class NameModelAdapter extends TaskContentAdapter<NameModel>
{
  private readonly dimensionDir: string;

  constructor(
    imageDimensions: ImageDimensions,
    private readonly genConfig: NameModelGenConfig,
    private readonly chance: Chance.Chance)
  {
    super(imageDimensions);
    this.dimensionDir =
      `${imageDimensions.pixelWidth.toString()}x${imageDimensions.pixelHeight.toString()}`;
  }

  public allocateIterator(): IterableIterator<NameModel>
  {
    return taskGenerator(this.genConfig, this.chance);
  }

  public convertToModelString(sourceContent: NameModel): [number[], number[]]
  {
    const firstStr = sourceContent.firstName.join(' ');
    const firstArray = new Array<number>(firstStr.length);
    for (let ii = 0; ii < firstStr.length; ii++) {
      firstArray[ii] = firstStr.charCodeAt(ii);
    }

    const lastStr = sourceContent.lastName;
    const lastArray = new Array<number>(lastStr.length);
    for (let ii = 0; ii < lastStr.length; ii++) {
      lastArray[ii] = lastStr.charCodeAt(ii);
    }

    // return sourceContent.firstName.concat(sourceContent.lastName)
    //   .join(' ');
    return [lastArray, firstArray];
  }

  public convertToImagePath(sourceContent: NameModel): string
  {
    return path.join(
      this.dimensionDir,
      // sourceContent.lastName.join('-'),
      sourceContent.generation.toString(),
      `${sourceContent.firstName.join('-')}__${sourceContent.lastName}.png`
    );
  }

  public isNovelStrategy(sourceContent: NameModel): boolean
  {
    return false;
  }
}


export function* taskGenerator(
  genConfig: NameModelGenConfig, chance: Chance.Chance): IterableIterator<NameModel>
{
  function createNameParts(nameCount: number, wordCount: number): Array<Array<string>>
  {
    const retVal = new Array(nameCount);
    let ii = 0;
    while (ii < nameCount) {
      let jj = 0;
      const nameVal = new Array(wordCount);
      while (jj < wordCount) {
        const wordLen = {
          length: chance.rpg('1d5')[0] + chance.rpg('1d4')[0] + 1
        };
        const nextWord = chance.word(wordLen);
        nameVal[jj] = nextWord.charAt(0)
          .toUpperCase() + nextWord.substring(1);
        jj = jj + 1;
      }
      retVal[ii] = nameVal;
      ii = ii + 1;
    }

    return retVal;
  }

  let generation = !!genConfig.firstGeneration ? genConfig.firstGeneration : 1;
  while (true) {
    let givenNames = createNameParts(genConfig.givenNameCount, genConfig.givenNameWords);
    const familyNames = createNameParts(genConfig.familyNameCount, 1);

    console.log('Next batch of names have given=', givenNames, '; family=', familyNames);
    if (genConfig.middleNameCount > 0) {
      const middleNames = createNameParts(genConfig.middleNameCount, 1);
      const newGivenNames = new Array<Array<string>>(genConfig.givenNameCount * genConfig.middleNameCount);
      let ii = 0;
      for (const firstName of givenNames) {
        for (const middleName of middleNames) {
          newGivenNames[ii] = firstName.concat(middleName[0]);
          ii = ii + 1;
        }
      }
      givenNames = newGivenNames;
    }

    for (const firstName of givenNames) {
      for (const lastNames of familyNames) {
        const lastName = lastNames[0];
        yield {
          firstName,
          lastName,
          generation
        } as NameModel;
      }
    }

    generation = generation + 1;
  }
}

