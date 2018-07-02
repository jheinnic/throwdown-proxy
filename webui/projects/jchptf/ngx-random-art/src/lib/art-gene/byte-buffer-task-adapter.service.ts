import * as path from 'path';

import {TaskContentAdapter} from './task-content-adapter.interface';
import {TaskContentGenerator} from './task-content-generator.interface';
import * as crypto from "crypto";
import {TaskContentModels} from '../store/models/task-content.models';
import ByteBufferTaskDefinition = TaskContentModels.ByteBufferTaskDefinition;
import ByteBufferTaskGeneratorOptions = TaskContentModels.ByteBufferTaskGeneratorOptions;
import ImageDimensions = TaskContentModels.ImageDimensions;
import {Injectable} from '@angular/core';
import ByteBufferToken = TaskContentModels.ByteBufferToken;


@Injectable({
  providedIn: 'root'
})
export class ByteBufferTaskAdapterService extends TaskContentAdapter<ByteBufferTaskDefinition>
{
  private readonly dimensionDir: string;

  // TODO: Do not hard code a dependency on just one image dimension setting...
  constructor(public readonly imageDimensions: ImageDimensions)
  {
    super(imageDimensions);

    this.dimensionDir =
      `${imageDimensions.pixelWidth.toString()}x${imageDimensions.pixelHeight.toString()}`;
  }

  public convertToModelString(sourceContent: ByteBufferTaskDefinition): [number[], number[]]
  {
    return [sourceContent.prefix.tokenArray, sourceContent.suffix.tokenArray];
  }

  public convertToImagePath(sourceContent: ByteBufferTaskDefinition): string
  {
    return path.join(
      this.dimensionDir,
      sourceContent.genNumber.toString() + (
        sourceContent.novel ? '-New' : '-Orig'
      ),
      `${
        sourceContent.prefix.tokenString.slice(0, 32)
        }/${
        sourceContent.suffix.tokenString.slice(0, 32)
        }.png`
    );
  }

  public isNovelStrategy(sourceContent: ByteBufferTaskDefinition): boolean
  {
    return sourceContent.novel;
  }
}
