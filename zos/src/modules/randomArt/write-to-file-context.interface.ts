import {Canvas} from './canvas-consumer.interface';

export interface WriteToFileContext
{
  readonly outputFilePath: string;
  readonly canvas: Canvas;
}
