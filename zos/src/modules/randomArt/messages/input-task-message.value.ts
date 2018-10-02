import {ImageDimensions} from './image-dimensions.value';
import {TaskIdentity} from './task-identity.value';
import {ModelSeed} from './model-seed.value';

export class TaskDefinition
{
   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly imageDimensions: ImageDimensions,
      public readonly modelSeed: ModelSeed,
      public readonly relativeOutputPath: string
   ) { }
}

