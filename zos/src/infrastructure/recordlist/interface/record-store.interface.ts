import {IShufflePlanBuilder} from './record-shuffle-builder.interface';
import {IRewritePlanBuilder} from './rewrite-plan-builder.interface';


export interface IRecordStore {
   write(index: number, data: Buffer): Promise<void>;

   read(index: number): Promise<Buffer>;

   sendCacheHint(index: number, range: number): void;

   rewriteStore( director: (builder: IRewritePlanBuilder) => void, copyByDefault?: boolean ): Promise<void>

   shuffleStore( director: (builder: IShufflePlanBuilder) => void): Promise<void>

   hashRecord(index: number): Promise<Buffer>

   instanceName(): string;

   // findDigestForRecord(index: number): MerkleDigestLocator

   // findRecordForDigest(digest: MerkleDigestLocator): number|undefined;

   /*
   pinRecord(index: number): Promise<Buffer>;

   unpinRecord(index: number, forget?: boolean): void;

   forgetRecord(index: number): void;

   pinHash(index: number): Promise<Buffer>;

   unpinHash(index: number, forget?: boolean): Promise<Buffer>;

   forgetHash(index: number): void;

   isRecordCached(index: number): boolean;

   isRecordPinned(index: number): boolean;

   isHashCached(index: number): boolean;

   isHashPinned(index: number): boolean;

   unpinRecords(forget?: boolean): void;

   unpinHashes(forget?: boolean): void;

   unpinAll(forget?: boolean): void;

   forgetRecords(): void;

   forgetHashes(): void;

   forgetAll(): void;
   */
}