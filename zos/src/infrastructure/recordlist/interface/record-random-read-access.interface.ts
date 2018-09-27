export interface IRandomRecordReadAccess<T> {
   read(index: number, pin?: boolean): Promise<T>;

   preload(index: number, range: number, pin?: boolean): Promise<void>;

   unpin(index: number): void;

   unpinAll(): void;

   forget(index: number): void;

   forgetAll(): void;

   instanceName(): string;
}