import {Canvas} from 'canvas';

export interface WriteToFileContext
{
  readonly outputFilePath: string;
  readonly canvas: Canvas;
}
