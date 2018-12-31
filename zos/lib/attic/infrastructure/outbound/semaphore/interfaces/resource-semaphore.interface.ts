export interface IResourceSemaphore<T extends object> {
   readonly name: string;

   borrowResource( callback: (param: T) => void): void;
}