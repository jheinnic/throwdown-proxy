import {BlockMappedSubtreeLocator} from './locator/block-mapped-subtree-locator.interface';

export interface IDigestTreeStore {
   loadBlock(descriptor: BlockMappedSubtreeLocator): Promise<Buffer>;

   loadPreImageBlocks(descriptor: BlockMappedSubtreeLocator): Promise<Buffer[]>;

   storeBlock(descriptor: BlockMappedSubtreeLocator, data: Buffer): Promise<number>;
}