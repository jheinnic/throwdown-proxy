export interface IResourceAdapter<T> {
   publish(): T;

   recycle(): boolean;

   readonly wetArtifact: T;
}