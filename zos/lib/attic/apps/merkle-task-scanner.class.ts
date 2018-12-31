import {inject, injectable} from 'inversify';
import LRU from 'lru-cache';
import * as path from 'path';

import '@jchptf/reflection';
import {IMerkleCalculator, MERKLE_TYPES, BlockMappedDigestLocator, MerkleLayerLocator} from '@jchptf/merkle';
import {APPLICATION_SERVICE_TYPES} from './di';

export interface TaskDescriptor
{
   filePath: string;
}

@injectable()
export class MerkleTaskScanner
{
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly generator: IMerkleCalculator,
      @inject(
         APPLICATION_SERVICE_TYPES.PathMapCache) private readonly pathMapCache: LRU.Cache<BlockMappedDigestLocator, string>
   )
   {

   }

   * [Symbol.iterator](): Generator
   {
      const leafLayer: MerkleLayerLocator = this.generator.findLeafLayer();

      for (let nextDigest of this.generator.getDigestsOnLayer(leafLayer, true)) {
         const blockPath: IterableIterator<BlockMappedDigestLocator> =
            this.generator.getBlockMappedPathToRoot(nextDigest)!;

         const retVal: TaskDescriptor | undefined =
            this.doRecursiveSearch(blockPath);

         blockPath.return!();

         if (!!retVal) {
            yield {
               filePath: path.join(
                  retVal.filePath,
                  `${nextDigest.index}_${(1 + nextDigest.position).toString(16)}`
               )
            }
         }
      }
   }

   private doRecursiveSearch(pathIter: IterableIterator<BlockMappedDigestLocator>): TaskDescriptor
   {
      const nextResult: IteratorResult<BlockMappedDigestLocator> = pathIter.next();
      let retVal: TaskDescriptor;

      if (!nextResult.done) {
         const nextBlock: BlockMappedDigestLocator = nextResult.value!;

         if (this.pathMapCache.has(nextBlock)) {
            const filePath = this.pathMapCache.get(nextBlock)!;
            // console.log(`Cache hit for ${filePath} at ${nextBlock.blockLevel}`);

            retVal = {filePath};
         } else {
            retVal = this.doRecursiveSearch(pathIter);
            const myToken = `${nextBlock.blockLevel}-${nextBlock.blockOffset}`;

            const filePath = !!retVal
               ? path.join(retVal.filePath, myToken)
               : path.join('/', myToken);

            this.pathMapCache.set(nextResult.value, filePath);
            // console.log(`Cache miss for ${filePath} at ${nextBlock.blockLevel}`);

            retVal = {filePath};
         }
      }

      return retVal!;
   }
}