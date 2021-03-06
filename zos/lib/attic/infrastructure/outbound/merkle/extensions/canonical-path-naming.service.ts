import {inject, injectable, tagged} from 'inversify';
import * as LRU from 'lru-cache';
import * as path from 'path';

import {
   IDfsOrderBuilder, ICanonicalPathNaming, IMerkleCalculator, NamedPath
} from '../interface';
import {BlockMappedDigestLocator, MerkleDigestLocator, MerkleNodeType} from '../locator';
import {DepthFirstVisitMode} from '../traversal';
import {MERKLE_CACHE_TYPES, MERKLE_TAG_KEYS, MERKLE_TYPES} from '../di';

@injectable()
export class CanonicalPathNaming implements ICanonicalPathNaming
{
   // private readonly digestSuffix: string;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator)
      private readonly calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.LRUCache) @tagged(MERKLE_TAG_KEYS.LRUCacheType, MERKLE_CACHE_TYPES.Identity)
      private readonly lruCache: LRU.Cache<string, string>)
      // @inject(MERKLE_TYPES.CanonicalNamespaceRoot)
      // public readonly namespaceRoot: string,
      // @inject(MERKLE_TYPES.ContentPolicyLabel) @optional()
      // public readonly policyLabel: string,
      // @inject(MERKLE_TYPES.ContentTypeExtension) @optional()
      // public readonly typeExtension: string)
   {
      /*
      if (!! this.policyLabel) {
         if (!! this.typeExtension) {
            this.digestSuffix = `_${policyLabel}.${typeExtension}`;
         } else {
            this.digestSuffix = `_${policyLabel}`;
         }
      } else if (!! this.typeExtension) {
         this.digestSuffix = `.${typeExtension}`;
      } else {
         this.digestSuffix = '';
      }
      */
   }

   private * findAllBlockPathNamesDepthFirst(
      leftToRight: boolean = true
   ): IterableIterator<NamedPath<BlockMappedDigestLocator>[]>
   {
      const pathTokens: NamedPath<BlockMappedDigestLocator>[] = [];
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
         const name = this.getBlockNamePart(nextElement)
         pathTokens.splice(level, pathTokens.length, { pathTo: nextElement, name });

         yield [...pathTokens];
      }
   }

   public* findAllBlocksPathNamesDepthFirst(
      namespaceRoot: string,
      leftToRight: boolean = true
   ): IterableIterator<NamedPath<BlockMappedDigestLocator>>
   {
      for (let nextPath of this.findAllBlockPathNamesDepthFirst(leftToRight)) {
         const element = nextPath[nextPath.length - 1].pathTo;
         const name = path.join(
            namespaceRoot,
            ...nextPath.map((pathElement) => pathElement.name)
         );
         yield { name, pathTo: element };
      }
   }

   public* findLeafBlockPathNames(
      namespaceRoot: string,
      leftToRight: boolean = true
   ): IterableIterator<NamedPath<BlockMappedDigestLocator>>
   {
      for (let nextPath of this.findAllBlockPathNamesDepthFirst(leftToRight)) {
         if (nextPath.length === this.calculator.tierCount) {
            const element = nextPath[nextPath.length - 1].pathTo;
            const name = path.join(
               namespaceRoot,
               ...nextPath.map((pathElement) => pathElement.name)
            );
            yield { name, pathTo: element };
         }
      }
   }

   public* findLeafDigestPathNames(
      namespaceRoot: string, leftToRight: boolean = true, digestSuffix?: string
   ): IterableIterator<NamedPath<MerkleDigestLocator>>
   {
      for (let nextBlock of this.findLeafBlockPathNames(namespaceRoot))
      {
         const currentDirectory = nextBlock.name;
         for (let nextDigest of this.calculator.getDigestsInBlockSubtree(
            nextBlock.pathTo, false, leftToRight
         )) {
            if (nextDigest.nodeType === MerkleNodeType.LEAF) {
               yield {
                  name: path.join(
                     namespaceRoot,
                     currentDirectory,
                     this.getLeafDigestNamePart(nextDigest) +
                     digestSuffix),
                  pathTo: nextDigest
               };
            }
         }
      }
   }

   public getBlockPathName(
      namespaceRoot: string,
      digestBlock: BlockMappedDigestLocator): NamedPath<BlockMappedDigestLocator>
   {
      const pathSteps =
         [...this.calculator.getBlockMappedPathToRoot(digestBlock)].map(
            (nextBlock) => this.getBlockNamePart(nextBlock))
            .reverse();
      return {
         name: path.join( namespaceRoot, ...pathSteps ),
         pathTo: digestBlock
      };
   }

   public getLeafDigestPathName(
      namespaceRoot: string,
      leafDigest: MerkleDigestLocator,
      digestSuffix?: string
   ): NamedPath<MerkleDigestLocator>
   {
      const outerBlock = this.calculator.findNearestBlockMappedRoot(leafDigest);

      return {
         name: path.join(
            this.getBlockPathName(namespaceRoot, outerBlock).name,
            this.getLeafDigestNamePart(leafDigest) +
            digestSuffix
         ),
         pathTo: leafDigest
      };
   }

  private getBlockNamePart(blockMappedRoot: BlockMappedDigestLocator): string
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

   private getLeafDigestNamePart(leafDigest: MerkleDigestLocator): string
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