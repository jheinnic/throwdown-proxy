export interface IRandomArtGenerator {
   start(workerCount: number): void;

   stop(): void;
}