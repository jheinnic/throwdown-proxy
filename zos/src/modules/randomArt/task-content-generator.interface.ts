export interface ITaskContentGenerator<Content> extends AsyncIterable<Content>
{
  // allocateIterator(): AsyncIterableIterator<Content>;
}

export abstract class TaskContentGenerator<Content> implements ITaskContentGenerator<Content> {
  constructor( ) {
  }

   public abstract[Symbol.asyncIterator](): AsyncIterator<Content>;

  // abstract allocateIterator(): IterableIterator<Content>;
}
