import {IDfsOrderBuilder, IDigestIdentityService, IMerkleCalculator} from './interface';
import {BlockMappedDigestLocator, MerkleDigestLocator, MerkleNodeType} from './locator';
import * as path from 'path';
import * as LRU from 'lru-cache';
import {injectable} from 'inversify';
import {DepthFirstVisitMode} from './index';


@injectable()
export class DigestIdentityService implements IDigestIdentityService
{
   constructor(
      private readonly calculator: IMerkleCalculator,
      private readonly lruCache: LRU.Cache<MerkleDigestLocator, string>)
   {
   }

   public* findAbsolutePathsToLeafNodes(leftToRight: boolean = true): IterableIterator<string>
   {
      const pathTokens: string[] = [];
      let currentDirectory: string;

      for (let nextBlock of this.calculator.getDfsBlockOrder(
         (builder: IDfsOrderBuilder) => {
            builder.visitMode(DepthFirstVisitMode.PRE_ORDER)
               .leftToRight(leftToRight)
               .finalLayer(
                  this.calculator.findLeafBlockMappedLayer()
               );
         }))
      {
         const level = nextBlock.blockLevel;
         pathTokens.splice(level, pathTokens.length, `${nextBlock.blockLevel}-${nextBlock.blockOffset}`);

         // We track the directory path from root in order to have it available when iterating through
         // the leaf layer digests, but for this traversal we only yield for each digest at the leaf layer,
         // so we need not concatenate the path nodes when visiting higher level..
         // let currentDirectory = path.join(...pathTokens);
         // yield currentDirectory;

         if (nextBlock.blockLevel === (this.calculator.tierCount - 1))
         {
            currentDirectory = path.join(...pathTokens)
            for (let nextDigest of this.calculator.getDigestsInBlockSubtree(nextBlock, false, leftToRight)) {
               if (nextDigest.nodeType === MerkleNodeType.LEAF) {
                  yield path.join(currentDirectory, this.getLocalNameFromLeafDigest(nextDigest));
               }
            }
         }
      }
   }

   public getAbsolutePathToBlock(digestBlock: BlockMappedDigestLocator): string
   {
      const pathSteps =
         [...this.calculator.getBlockMappedPathToRoot(digestBlock)].map(
            (nextBlock) => `${nextBlock.blockLevel}-${nextBlock.blockOffset}`)
            .reverse();
      return path.join('/', ...pathSteps);
   }

   public getAbsoluteBlockPathToLeafDigest(leafDigest: MerkleDigestLocator,): string
   {
      const outerBlock = this.calculator.findNearestBlockMappedRoot(leafDigest);

      return path.join(
         this.getAbsoluteBlockPathToLeafDigest(outerBlock),
         this.getLocalNameFromLeafDigest(leafDigest)
      );
   }

   public getBlockByAbsolutePathName(_: string): BlockMappedDigestLocator
   {
      throw new OperationNotCompletedException();
   }

   public getLeafDigestByAbsolutePathName(_: string): MerkleDigestLocator
   {
      throw new OperationNotCompletedException();
   }

   public getLocalNameFromBlock(blockMappedRoot: BlockMappedDigestLocator): string
   {
      if (this.lruCache.has(blockMappedRoot)) {
         return this.lruCache.get(blockMappedRoot)!
      }

      let retVal = path.join(
         `${blockMappedRoot.blockLevel}-${blockMappedRoot.blockOffset}`);
      this.lruCache.set(blockMappedRoot, retVal);

      return retVal;
   }

   public getLocalNameFromLeafDigest(leafDigest: MerkleDigestLocator): string
   {
      if (this.lruCache.has(leafDigest)) {
         return this.lruCache.get(leafDigest)!
      }

      let retVal = path.join(`${leafDigest.index}_${(
         1 + leafDigest.position
      ).toString(16)}`);
      this.lruCache.set(leafDigest, retVal);

      return retVal;
   }
}