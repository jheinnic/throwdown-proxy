import {ImageDimensions} from './image-dimensions.interface';

export interface ITaskContentGenerator<Content> extends Iterable<Content>
{
  [Symbol.iterator](): Iterator<Content>;
}

export abstract class TaskContentGenerator<Content> implements ITaskContentGenerator<Content> {
  abstract [Symbol.iterator](): Iterator<Content>;
}
