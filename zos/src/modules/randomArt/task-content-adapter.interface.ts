import {ImageDimensions} from './image-dimensions.interface';

export interface ITaskContentAdapter<Content>
{
  readonly pixelWidth: number;

  readonly pixelHeight: number;

  readonly fitOrFill: 'square' | 'fit' | 'fill';

  // allocateIterator(): IterableIterator<Content>;

  isNovelStrategy(sourceContent: Content): boolean;

  convertToModelString(sourceContent: Content): [number[], number[]];

  convertToImagePath(sourceContent: Content): string;
}

export abstract class TaskContentAdapter<Content> implements ITaskContentAdapter<Content> {
  constructor( protected readonly imageDimensions: ImageDimensions ) {
  }

  get pixelWidth(): number {
    return this.imageDimensions.pixelWidth;
  }

  get pixelHeight(): number {
    return this.imageDimensions.pixelHeight;
  }

  get fitOrFill(): 'square' | 'fit' | 'fill' {
    return this.imageDimensions.fitOrFill;
  }

  // abstract allocateIterator(): IterableIterator<Content>;

  abstract isNovelStrategy(sourceContent: Content): boolean;

  abstract convertToModelString(sourceContent: Content): [number[], number[]];

  abstract convertToImagePath(sourceContent: Content): string;
}
