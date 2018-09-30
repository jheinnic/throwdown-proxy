import {inject, injectable, tagged} from 'inversify';
import * as LRU from 'lru-cache';
import * as path from 'path';

import {
   IDfsOrderBuilder, IDigestIdentityService, IMerkleCalculator, NamedElement
} from '../interface';
import {BlockMappedDigestLocator, MerkleDigestLocator, MerkleNodeType} from '../locator';
import {DepthFirstVisitMode} from '../traversal';
import {MERKLE_CACHE_TYPES, MERKLE_TAG_KEYS, MERKLE_TYPES} from '../di';

@injectable()
export class DigestIdentityService implements IDigestIdentityService
{
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator)
      private readonly calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.LRUCache) @tagged(MERKLE_TAG_KEYS.LRUCacheType, MERKLE_CACHE_TYPES.Identity)
      private readonly lruCache: LRU.Cache<string, string>)
   { }

   private* findBlockElementsPathsDepthFirst(
      leftToRight: boolean = true
   ): IterableIterator<NamedElement<BlockMappedDigestLocator>[]>
   {
      const pathTokens: NamedElement<BlockMappedDigestLocator>[] = [];
      for (let nextElement of this.calculator.getDfsBlockOrder(
         (builder: IDfsOrderBuilder) => {
            builder.visitMode(DepthFirstVisitMode.PRE_ORDER)
               .leftToRight(leftToRight)
               .endWith(
                  this.calculator.findLeafBlockLayer()
               );
         }))
      {
         const level = nextElement.blockLevel;
         const name = this.getLocalNameFromBlock(nextElement);
         pathTokens.splice(level, pathTokens.length, { element: nextElement, name });

         yield [...pathTokens];
      }
   }

   public* findBlocksDepthFirstWithAbsolutePath(
      leftToRight: boolean = true
   ): IterableIterator<NamedElement<BlockMappedDigestLocator>>
   {
      for (let nextPath of this.findBlockElementsPathsDepthFirst(leftToRight)) {
         const element = nextPath[nextPath.length - 1].element;
         const name = path.join(...nextPath.map((pathElement) => pathElement.name));
         yield { name, element };
      }
   }

   public* findLeafBlocksWithAbsolutePath(
      leftToRight: boolean = true
   ): IterableIterator<NamedElement<BlockMappedDigestLocator>>
   {
      for (let nextPath of this.findBlockElementsPathsDepthFirst(leftToRight)) {
         if (nextPath.length === this.calculator.tierCount) {
            const element = nextPath[nextPath.length - 1].element;
            const name = path.join(...nextPath.map((pathElement) => pathElement.name));
            yield { name, element };
         }
      }
   }

   public* findLeafDigestsWithAbsolutePath(
      leftToRight: boolean = true
   ): IterableIterator<NamedElement<MerkleDigestLocator>>
   {
      for (let nextBlock of this.findLeafBlocksWithAbsolutePath())
      {
         const currentDirectory = nextBlock.name;
         for (let nextDigest of this.calculator.getDigestsInBlockSubtree(
            nextBlock.element, false, leftToRight
         )) {
            if (nextDigest.nodeType === MerkleNodeType.LEAF) {
               yield {
                  name: path.join(currentDirectory, this.getLocalNameFromLeafDigest(nextDigest)),
                  element: nextDigest
               };
            }
         }
      }
   }

   public getAbsolutePathToBlock(digestBlock: BlockMappedDigestLocator): string
   {
      const pathSteps =
         [...this.calculator.getBlockMappedPathToRoot(digestBlock)].map(
            (nextBlock) => this.getLocalNameFromBlock(nextBlock))
            .reverse();
      return path.join('/', ...pathSteps);
   }

   public getAbsoluteBlockPathToLeafDigest(leafDigest: MerkleDigestLocator,): string
   {
      const outerBlock = this.calculator.findNearestBlockMappedRoot(leafDigest);

      return path.join(
         this.getAbsolutePathToBlock(outerBlock),
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
      if (! blockMappedRoot) {
         throw new Error('Block-mapped root digest must have a defined value');
      }

      const blockKey = `b${blockMappedRoot.blockOffset}`;
      let retVal = this.lruCache.get(blockKey);
      if (! retVal) {
         retVal = (
            blockMappedRoot.blockOffset === 0
         ) ? '/'
            : `${blockMappedRoot.blockLevel}-${blockMappedRoot.blockOffset}`;
         this.lruCache.set(blockKey, retVal);
      }

      return retVal;
   }

   public getLocalNameFromLeafDigest(leafDigest: MerkleDigestLocator): string
   {
      if (!leafDigest) {
         throw new Error('Leaf digest locator must have a defined value');
      } else if (leafDigest.nodeType !== MerkleNodeType.LEAF) {
         throw new Error(`Digest at position ${leafDigest.position} is not a leaf`);
      }

      const digestKey = `d${leafDigest.position}`;
      let retVal = this.lruCache.get(digestKey);
      if (! retVal) {
         retVal = path.join(`${leafDigest.index}_${(1 + leafDigest.position).toString(16)}`);
         this.lruCache.set(digestKey, retVal);
      }

      return retVal;
   }
}