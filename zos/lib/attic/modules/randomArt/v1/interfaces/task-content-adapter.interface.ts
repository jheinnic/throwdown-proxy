export interface ITaskContentAdapter<Content>
{
   isNovelStrategy(sourceContent: Content): boolean;

   convertToModelSeed(sourceContent: Content): [number[], number[]];

   convertToImagePath(sourceContent: Content, dimensionToken: string): string;
}

