export interface IDirectoryUtils {
   ensurePrivateDir(dirPath: string): Promise<string>;
   ensureWritableDir(dirPath: string): Promise<string>;
   ensurePrivateSubtree(rootDir: string, subtreePath: string): Promise<string>;
   ensureWritableSubtree(rootDir: string, subtreePath: string): Promise<string>;
}