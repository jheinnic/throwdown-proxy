import {Canvas} from 'canvas';
import {TaskIdentity} from './task-identity.value';

export class WriteOutputTaskMessage
{
   constructor(
      public readonly taskIdentity: TaskIdentity,
      public readonly canvas: Canvas,
      public readonly relativeOutputPath: string
   ) { }
}
