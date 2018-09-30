import {inject, injectable} from 'inversify';
import Optional from 'typescript-optional';
import bs from 'binary-search';

import {
   BlockMappedDigestLocator, BlockMappedLayerLocator, MerkleDigestLocator, MerkleLayerLocator,
   MerkleNodeType, MerkleOrientationType, MerkleProofLocator, MerkleTreeDescription
} from './locator';
import {
   IMerkleCalculator, IMerkleLocatorFactory, IDfsOrderBuilder, DfsOrderOptions, BfsOrderOptions,
   IBfsOrderBuilder
} from './interface';
import {
   DepthFirstOrder, BreadthFirstOrder, ITopoOrderBuilder, TopoOrderOptions
} from './traversal';
import {Director} from '../lib';
import {MERKLE_TYPES} from './di';
import '../reflection';
import * as util from 'util';
import {MerkleTopologicalOrder} from './traversal/merkle-topological-order.class';
import {BlockTopologicalOrder} from './traversal/block-topological-order.class';

/**
 * The MerkleCalculator provides a suite of methods that are useful when iterating over or traversing
 * through a MerkleTreeEngine-managed merkle tree.
 *
 * The MerkleTreeEngine implements a mapping between the Merkle tree's logical structure as a complete
 * binary tree with relatively small records at each node, and a compact physical arrangement that seeks
 * to maintain locality of reference and minimize the number of random access offsets required to perform
 * a complete leaf-to-root path traversal without requiring an excessive amount of cache storage during
 * operation.
 *
 * It works by conceptually decomposing complete Merkle trees along layer boundaries spaced at fixed
 * intervals.  The result is a forest, with subtrees of equal height, with each subtree of a given
 * non-leaf layer related to exactly twice as many subtrees in the layer below as there are leaves in
 * its own structure.  The sole exception is made at the root node, which is permitted to utilize a
 * smaller depth than everywhere else such that the original tree's depth minus the root overlay's
 * actual depth is a perfect multiple of the depth use for every other decomposed subtree.
 *
 * A complete binary tree of depth D has (2^D - 1) nodes.  Given an ideal I/O transfer size, R, and output
 * size H for hash digests, we know we can derive a density goal of R/H nodes per I/O.  MerkleTreeEngine's
 * uses largest value for D such that (2^D - 1) <= R/H.  For example, given an I/O transfer unit of 8K and
 * a hash digest size of 256 bits:
 *
 * R / H = ((8192 bytes per transfer * 8 bits per byte) / (256 bits per hash)) = 256 hashes per transfer
 *
 * ...such that...
 *
 * 2^D - 1 <= 256
 * log2(D) <= log2(257)
 *      D ~<= 8
 *
 * Given these sizing parameters, MerkleTreeEngine will map every 8 levels of hashes to a single 8KB write.
 * Imagine further that an instance of such a tree is to allocate storage for 2,000,000 entries.
 *
 * log2(2000000) =~ 20.932 <= 21
 *
 * It is not possible to divide partition 21 into some multiple of 8.  There are ways to split 16 or 24,
 * but not 21.  The storage block closest to root is the sole exception that makes it simpler to follow
 * the convention throughout the remainder of any given Merkle tree.  It does, however, burden
 * MerkleTreeEngine with an obligation to track correlations between physical and conceptual notions of
 * place and partial ordering.  MerkleCalculator exists to hide the implementation details and math behind
 * MerkleTreeEngine's needs to map from the logical to the physical and back again
 * of the math required to map between the logical and physical addressing.  The resulting engine code
 * becomes a little more declarative, allowing its code to be read as descriptions of the calculations
 * it requires without having to describe how those calculation requirements are to be met.
 *
 * Consumers and developers of this API are strongly encouraged to review the terminology that follows.
 * There are cases where the author has found it necessary to use synonymous terms to describe concepts
 * that are likewise similar except for the critically important few ways they are different.  This
 * leads to more concise method names in API design, but creates a necessity to help consumers
 * recognize when they need a glossary to resolve what otherwise should seem ambiguous.
 *
 * === Depth and Width, Level and Span ===
 *
 * The first such example involves these relations:
 * "Depth" is to "Width" as "Level" is to "Span" as "Height" is to "Reach"
 * -- "Depth" refers to the number of steps required by any proof constructed from a given Merkle Tree, and
 *    Width refers to the maximum number of distinct items that can be spoken for using a Merkle Tree of
 *    some "Depth".

 * -- "Height" is used to measure the distance between root and leaf in each block-mapped subtree after
 *    the Merkle tree has been conceptually "split" for the sake of crafting I/O blocks.  Reach is then
 *    used with one of two modifiers to count at the base of each subtree.  Reach is aways defined in the
 *    context of a subtree's root node.
 *    -- "Internal Reach" refers to the number of nodes that are leaves still connected to the contextual
 *       root.
 *    -- "External Reach" refers to the set of root nodes that were previously children of what are now
 *       "leaf" nodes from the "Internal Reach"
 *    -- "Root" further modifies "Internal Reach" and "External Reach" to account for its unique record
 *       count.
 *    -- The only time "Height" is modified is when we talk of "Root Height".
 *
 * -- "Level" uses the number of I/O transfers required along a path from a given leaf to the tree's
 *    Merkle Root.  "Span" is a metric that changes from Level to Level.  It counts the number of subtrees
 *    that were severed across all subtrees at a given layer.
 *
 * === REDO: Depth, Width, Level, Span, Height, and Reach
 *
 * -- Depth is used to place a
 *
 * === Address, Offset, and Index ===
 *
 * The next set of terms are all ways of identifying a specific record using some measurement of distance.
 *
 * -- Address is used to identify a distinct preImage from the source data set, but does do using the
 *    corresponding location of its initial hash digest relative to the start of the Merkle Tree.  Because
 *    the entire Merkle Tree is not necessarily ever stored all in memory at once, this value is not very
 *    useful for indexed access, but it is often used when forming or updating the membership proof for
 *    an element since its sequence of 0's and 1's will chart out the series of left and and right
 *    traversal steps required to reach targeted digest
 *    -- The Address of a pre-image element and the Offset of its Digest would be the same value, but since
 *       the digests of a Merkle Tree are never really stored in sequential order, we instead use
 *       the term "Address" to defined "that which we cannot have".
 * -- Offset is used to identify an indexed random access into physical storage and is 0-based from the
 *    root node.
 * -- Index provides a Partial Order o
 */
@injectable()
export class MerkleCalculator implements IMerkleCalculator
{
   public constructor(
      @inject(MERKLE_TYPES.MerkleTreeDescription)
      public readonly treeDescription: MerkleTreeDescription,
      @inject(MERKLE_TYPES.MerkleLocatorFactory)
      private readonly locatorFactory: IMerkleLocatorFactory
   )
   {
   }

   public get subtreeDepth(): number
   {
      return this.treeDescription.subtreeDepth;
   }

   public get blockMappedLeafLayers(): ReadonlyArray<number>
   {
      return this.treeDescription.blockMappedLeafLayers;
   }

   public get blockMappedRootLayers(): ReadonlyArray<number>
   {
      return this.treeDescription.blockMappedRootLayers;
   }

   /**
    * 2^D, where D is the depth (or height) of the subtree.  The layer of block roots above or below any
    * other block root node is always D layers away, and the number of internal nodes in any block subtree
    * will always be ((2^D) - 1).  There is a slight exception to this rule for the deepest physical layer
    * of a Merkle Tree that uses a number of layers that does not divide evenly into the ideal subtree
    * height for its block size to node size ratio.
    *
    * This number is frequently useful for calculations that have to deal with finding the "absolute"
    * logical offset range for all 2^D roots from the next lower physical layer whose values are needed
    * to calculate all 2^(D-1) leaf nodes of a block-mapped subtree from "current" physical layer.
    *
    * For example, if a logical Merkle tree has been partitioned for mapping to physical blocks along
    * boundaries that split the overall tree into a forest of subtrees, each four layers high, then there
    * are 2^4 = 16 roots below each of the internal subtrees needed to calculate each of its' own 2^3 = 8
    * leaf nodes.  A tree divided this way will define subtreeReach = 16, and subtreeWidth = 8,
    * and calculations will frequently retrieve one value or the other by private field reference.
    */
   public get subtreeReach(): number
   {
      return this.treeDescription.subtreeReach;
   }

   /**
    * 2^(D-1), where D is the depth (or height) of the subtree.  The layer of logical leaf nodes at the
    * base of any given block-based subtree will always be D-1 layers away from their root.  There
    * will always be 2^(D-1) such leaves, and the subtree itself will contain ((2^D) - 1) nodes overall.
    *
    * This number is frequently useful for calculations that have to deal with finding the "absolute"
    * logical offset range for all 2^D roots from the next lower physical layer whose values are needed
    * to calculate all 2^(D-1) leaf nodes of a block-mapped subtree from "current" physical layer.
    *
    * For example, if a logical Merkle tree has been partitioned for mapping to physical blocks along
    * boundaries that split the overall tree into a forest of subtrees, each four layers high, then there
    * are 2^4 = 16 roots below each of the internal subtrees needed to calculate each of its' own 2^3 = 8
    * leaf nodes.  A tree divided this way will define subtreeReach = 16, and subtreeWidth = 8,
    * and calculations will frequently retrieve one value or the other by private field reference.
    */
   public get subtreeWidth(): number
   {
      return this.treeDescription.subtreeWidth;
   }

   /**
    * To generalize this block partitioning strategy to apply generally to all potential Merkle trees, it
    * becomes necessary to concede that not every possible tree depth will require a perfect multiple of
    * the ideal subtree height for optimal block packing.  For 8192 byte blocks, and 256 bit hash
    * values, the optimal fit is a 7-layer subtree, with 127 internal nodes and 128 leaves, consuming
    * 8160 out of every 8192 bytes.  By coincidence, the initial trees to be deployed with this utility
    * happen to be 21-layers tall, but they could easily grow to require 22-layers or shrink to require
    * only 20.  In fact, it is almost certain that the initial protocol will periodically compact the
    * merkle trees to remove space that is no longer required as records are to be removed over time.
    *
    * To compensate for this reality, this library will remove overflow layers from the root node such
    * that the forest that remains after it has been removed is a perfect multiple that can use optimal
    * blocks for the rest of its span.  The purpose of this variable is to store the actual depth to use
    * instead of interlayerWidth for just the special case of the root node.
    */
   public get rootSubtreeWidth(): number
   {
      return this.treeDescription.rootSubtreeWidth;
   }

   /**
    * For cases where the logarithm of layer width is used in a calculation rather than its absolute
    * value, rootDepthReduction tracks how many fewer layers the root node has when compared to
    * interTreeDistance.
    */
   public get rootSubtreeDepth(): number
   {
      return this.treeDescription.rootSubtreeDepth;
   }

   public get rootSubtreeReach(): number
   {
      return this.treeDescription.rootSubtreeReach;
   }

   public get treeDepth(): number
   {
      return this.treeDescription.treeDepth;
   }

   public get tierCount(): number
   {
      return this.treeDescription.tierCount;
   }

   // public* getBlockMappedLeafLayerLocators(): IterableIterator<MerkleLayerLocator>
   // {
   //    const maxIndex = this.treeDescription.tierCount;
   //    for (let nextIndex = 0; nextIndex < maxIndex; nextIndex++) {
   //       yield this.locatorFactory.findLayerByDepth(
   //          this.blockMappedLeafLayers[nextIndex]);
   //    }
   // }

   public* getBlockMappedRootLayerLocators(): IterableIterator<BlockMappedLayerLocator>
   {
      const maxIndex = this.treeDescription.tierCount;
      for (let nextIndex = 0; nextIndex < maxIndex; nextIndex++) {
         yield this.locatorFactory.findLayerByDepth(
            this.blockMappedRootLayers[nextIndex])
            .asBlockMapped()
            .get()
      }
   }

   public* getLayers(topDown: boolean = true): IterableIterator<MerkleLayerLocator>
   {
      if (topDown) {
         const maxIndex = this.treeDescription.treeDepth;
         for (let nextIndex = 0; nextIndex < maxIndex; nextIndex++) {
            yield this.locatorFactory.findLayerByDepth(nextIndex);
         }
      } else {
         for (let nextIndex = this.treeDescription.treeDepth - 1; nextIndex >= 0; nextIndex--) {
            yield this.locatorFactory.findLayerByDepth(nextIndex);
         }
      }
   }

   public* getDigestsOnLayer(
      targetLayer: MerkleLayerLocator, leftToRight: boolean = true): IterableIterator<MerkleDigestLocator>
   {
      const lastIndex = leftToRight ? targetLayer.size - 1 : 0;
      const digestStep = leftToRight ? 1 : -1;
      const stopIndex = lastIndex + digestStep;
      let currentIndex = targetLayer.size - 1 - lastIndex;

      while (currentIndex != stopIndex) {
         yield this.locatorFactory.findDigestByLayerAndIndex(targetLayer, currentIndex);
         currentIndex += digestStep;
      }
      yield this.locatorFactory.findDigestByLayerAndIndex(targetLayer, currentIndex);
   }

   public* getChildDigests(parent: MerkleDigestLocator, leftToRight: boolean = true) {
      if (parent.nodeType === MerkleNodeType.LEAF) {
         return;
      }

      const layer = parent.layer;
      if (leftToRight) {
         const firstChildPosition =
            layer.rightPosition + 1 + (2 * parent.index);
         yield this.locatorFactory.findDigestByPosition(firstChildPosition);
         yield this.locatorFactory.findDigestByPosition(firstChildPosition + 1);
      } else {
         const firstChildPosition =
            layer.rightPosition + 2 + (2 * parent.index);
         yield this.locatorFactory.findDigestByPosition(firstChildPosition);
         yield this.locatorFactory.findDigestByPosition(firstChildPosition - 1);
      }
   }

   public getDigestsOnLeafLayer(leftToRight: boolean = true): IterableIterator<MerkleDigestLocator>
   {
      return this.getDigestsOnLayer(
         this.locatorFactory.findLayerByDepth(this.treeDescription.treeDepth - 1), leftToRight);
   }

   public* getRelatedDigestsOnLayer(fromRoot: MerkleDigestLocator, onLayer: MerkleLayerLocator, leftToRight: boolean = true) {
      if (onLayer.depth <= fromRoot.depth) {
         throw new Error(`Root layer, ${fromRoot.depth}, must be above iteration layer, ${onLayer.depth}`);
      }
      const distanceFactor = Math.pow(2, onLayer.depth - fromRoot.depth);
      const leftRelatedIndex = fromRoot.index * distanceFactor;
      const rightRelatedIndex = leftRelatedIndex + distanceFactor - 1;
      let currentIndex = leftToRight ? leftRelatedIndex : rightRelatedIndex;
      let stopIndex = leftToRight ? rightRelatedIndex + 1 : leftRelatedIndex - 1;
      let stepSize = leftToRight ? 1 : -1;

      while (currentIndex !== stopIndex) {
         yield this.locatorFactory.findDigestByLayerAndIndex(onLayer, currentIndex);
         currentIndex += stepSize;
      }
   }

   public* getBlockMappedLayers(topDown: boolean = true): IterableIterator<BlockMappedLayerLocator>
   {
      if (topDown) {
         const maxIndex = this.treeDescription.tierCount;
         for (let nextIndex = 0; nextIndex < maxIndex; nextIndex++) {
            yield this.locatorFactory.findBlockMappedLayerByLevel(nextIndex);
         }
      } else {
         for (let nextIndex = this.treeDescription.tierCount - 1; nextIndex >= 0; nextIndex--) {
            yield this.locatorFactory.findBlockMappedLayerByLevel(nextIndex);
         }
      }
   }

   public getTopoDigestOrder(director: Director<ITopoOrderBuilder>): Iterable<MerkleDigestLocator>
   {
      const options = TopoOrderOptions.create(director);
      return new MerkleTopologicalOrder(this, this.treeDescription, options);
   }

   public getTopoBlockOrder(director: Director<ITopoOrderBuilder>): Iterable<BlockMappedDigestLocator>
   {
      const options = TopoOrderOptions.create(director);
      return new BlockTopologicalOrder(this, this.treeDescription, options);
   }

   public getBfsBlockOrder(director: Director<IBfsOrderBuilder>): Iterable<BlockMappedDigestLocator>
   {
      const options = BfsOrderOptions.create(director);
      console.log(util.inspect(options, true, 5, true));
      return new BreadthFirstOrder(this, options);
   }

   public getDfsBlockOrder(director: Director<IDfsOrderBuilder>): Iterable<BlockMappedDigestLocator>
   {
      const options = DfsOrderOptions.create(director);
      console.log(util.inspect(options, true, 5, true));
      return new DepthFirstOrder(this, this.treeDescription, options);
   }

   public* getDigestPathToRoot(fromDigest: MerkleDigestLocator): IterableIterator<MerkleDigestLocator>
   {
      let currentBlock = this.findParentDigest(fromDigest);

      while (!!currentBlock) {
         yield currentBlock;
         currentBlock = this.findParentDigest(currentBlock);
      }
   }

   public* getChildBlockMappedRoots(parent: BlockMappedDigestLocator, leftToRight: boolean = true): IterableIterator<BlockMappedDigestLocator>
   {
      if (parent.blockLevel >= (this.treeDescription.tierCount - 1))
      {
         // No children beyond lowest leaf level.
         return;
      }

      const parentLevel = parent.rootLayer;
      const parentReach = parent.blockReach;
      const leftChildOffset = parentLevel.rightOffset + 1 + (parentReach * parent.index);
      const rightChildOffset = leftChildOffset + parentReach - 1;

      const firstChildOffset = leftToRight ? leftChildOffset : rightChildOffset;
      const stopOffset = leftToRight ? (rightChildOffset + 1) : (leftChildOffset - 1);
      const stepSize = leftToRight ? 1 : -1;

      for (let ii = firstChildOffset; ii !== stopOffset; ii += stepSize ) {
         // TODO: Watch this for accuracy.
	       // console.log('Yielding offset ' + ii + ' for ' + parentLevel);
         yield this.locatorFactory.findBlockMappedDigestByOffset(ii);
      }
   }

   public* getRelatedBlockMappedRootsOnLevel(
      fromRoot: BlockMappedDigestLocator,
      onLayer: BlockMappedLayerLocator,
      leftToRight: boolean = true): IterableIterator<BlockMappedDigestLocator>
   {
      if (onLayer.level <= fromRoot.blockLevel) {
         throw new Error(`Root level, ${fromRoot.blockLevel}, must be above iteration layer, ${onLayer.level}`);
      }
      const layerSpan = onLayer.level - fromRoot.blockLevel;
      let distanceFactor = (fromRoot.blockOffset === 0) ? this.rootSubtreeReach : this.subtreeReach;
      for (let ii=1; ii<layerSpan; ii++) {
         distanceFactor = distanceFactor * this.subtreeReach
      }
      const leftRelatedIndex = fromRoot.index * distanceFactor;
      const rightRelatedIndex = leftRelatedIndex + distanceFactor - 1;
      let currentIndex = leftToRight ? leftRelatedIndex : rightRelatedIndex;
      let stopIndex = leftToRight ? rightRelatedIndex + 1 : leftRelatedIndex - 1;
      let stepSize = leftToRight ? 1 : -1;

      while (currentIndex !== stopIndex) {
         yield this.locatorFactory.findBlockMappedDigestByLayerAndIndex(onLayer, currentIndex);
         currentIndex += stepSize;
      }
   }

   public* getBlockMappedPathToRoot(fromDigest: MerkleDigestLocator): IterableIterator<BlockMappedDigestLocator>
   {
      let currentBlock: BlockMappedDigestLocator =
         this.findNearestBlockMappedRoot(fromDigest);

      while (!!currentBlock && currentBlock.position > 0) {
         yield currentBlock as BlockMappedDigestLocator;
         currentBlock = this.findNearestBlockMappedRoot(
            this.findParentDigest(currentBlock)!
         );

         // const parentRootDepth = currentBlock.depth - this.treeDescription.subtreeDepth
         // const parentLayer = this.locatorFactory.findLayerByDepth(parentRootDepth);
         // const parentIndex =
         //    (currentBlock.index - (currentBlock.index % this.treeDescription.subtreeReach))
         //    / this.treeDescription.subtreeReach;
         //
         // currentBlock =
         //    this.locatorFactory.findDigestByLayerAndIndex(
         //       parentLayer, parentIndex) as BlockMappedDigestLocator;
      }

      if (!!currentBlock) {
         yield currentBlock;
      }
   }

   // public* getBlockMappedPathFromRoot(fromDigest: MerkleDigestLocator): IterableIterator<BlockMappedDigestLocator>
   // {
   //    let finalBlock = this.findNearestBlockMappedRoot(fromDigest);
   //    let currentBlock = this.findNearestBlockMappedRoot(
   //       this.findDigestByPosition(0)
   //    );
   //
   //    while (currentBlock.blockLevel !== finalBlock.blockLevel) {
   //       yield currentBlock;
   //
   //       for (let nextChild of this.getChildBlockMappedRoots(currentBlock)) {
   //          const nextRightmostDescendant = this.findFurthestDescendant(nextChild, false);
   //          const nextRightmostBlock = this.findNearestBlockMappedRoot(nextRightmostDescendant);
   //          if (finalBlock.blockOffset <= nextRightmostBlock.blockOffset) {
   //             currentBlock = nextChild;
   //             break;
   //          }
   //       }
   //    }
   // }

   public* getBlockMappedPathFromRoot(toDigest: MerkleDigestLocator): IterableIterator<BlockMappedDigestLocator>
   {
      let path = [...this.getBlockMappedPathToRoot(toDigest)];
      let fromDigest: BlockMappedDigestLocator;
      for (fromDigest of path.reverse()) {
         yield fromDigest;
      }
   }

   public* getDigestsInBlockSubtree(
      block: BlockMappedDigestLocator,
      topDown: boolean = false,
      leftToRight: boolean = false): IterableIterator<MerkleDigestLocator>
   {
      let currentLayer: MerkleLayerLocator;
      let currentDigest: MerkleDigestLocator;
      let currentIndex: number;
      let stopLayerDepth: number;
      let lastDigestIndex: number;
      let firstDigestIndex: number;
      let currentWidth: number;

      const layerStep: number = topDown ? 1 : -1;
      const digestStep: number = leftToRight ? 1 : -1;
      const widthStep: number = topDown ? 2 : 0.5;

      if (topDown) {
         currentLayer = block.layer;
         currentWidth = 1;
         firstDigestIndex = 0;
         lastDigestIndex = 0;
         stopLayerDepth = block.leafDepth + 1;
      } else {
         currentLayer = block.leafLayer;
         currentWidth = block.blockWidth;
         firstDigestIndex = leftToRight ? block.leftLeafSpan : block.rightLeafSpan;
         lastDigestIndex = leftToRight ? block.rightLeafSpan : block.leftLeafSpan;
         stopLayerDepth = block.rootDepth - 1;
      }

      while (currentLayer.depth !== stopLayerDepth) {
         currentIndex = firstDigestIndex;
         currentDigest = this.locatorFactory.findDigestByLayerAndIndex(currentLayer, currentIndex);

         while (currentDigest.index !== lastDigestIndex) {
            yield currentDigest;
            currentIndex += digestStep;
            currentDigest = this.locatorFactory.findDigestByLayerAndIndex(currentLayer, currentIndex);
         }
         yield currentDigest;

         currentLayer = this.locatorFactory.findLayerByDepth(currentLayer.depth + layerStep);
         currentWidth *= widthStep;
         firstDigestIndex *= widthStep;
         lastDigestIndex = firstDigestIndex + (
            digestStep * currentWidth
         ) - digestStep;
      }
   }

   public* getSubtreesOnBlockMappedLayer(
      targetLayer: BlockMappedLayerLocator, leftToRight: boolean = true): IterableIterator<BlockMappedDigestLocator>
   {
      for (let nextDigest of this.getDigestsOnLayer(targetLayer, leftToRight)) {
         yield nextDigest.asBlockMapped().get();
      }
   }

   public findLayerByDepth(depth: number): MerkleLayerLocator
   {
      if ((depth < 0) || (depth >= this.treeDescription.treeDepth))
      {
         throw new Error(
            `Layer depths must be between 0 and ${this.treeDescription.treeDepth
            - 1}; ${depth} is out of bounds.`);
      }

      return this.locatorFactory.findLayerByDepth(depth);
   }

   public findLeafLayer(): MerkleLayerLocator
   {
      return this.locatorFactory.findLayerByDepth(
         this.treeDescription.treeDepth - 1
      );
   }

   public findParentLayer(fromLayer: MerkleLayerLocator): MerkleLayerLocator | undefined
   {
      if (fromLayer.depth === 0) {
         return undefined;
      }

      return this.locatorFactory.findLayerByDepth(fromLayer.depth - 1);
   }

   public findChildLayer(fromLayer: MerkleLayerLocator): Optional<MerkleLayerLocator>
   {
      if (fromLayer.depth >= (this.treeDepth - 1)) {
         return Optional.empty();
      }

      return Optional.of(
         this.locatorFactory.findLayerByDepth(fromLayer.depth + 1));
   }

   public findBlockLayerByLevel(level: number): BlockMappedLayerLocator
   {
      if ((level < 0) || (level >= this.treeDescription.tierCount))
      {
         throw new Error(
            `Layer depths must be between 0 and ${this.treeDescription.treeDepth
            - 1}; ${level} is out of bounds.`);
      }

      return this.locatorFactory.findBlockMappedLayerByLevel(level);
   }

   public findLeafBlockLayer(): BlockMappedLayerLocator
   {
      return this.locatorFactory.findBlockMappedLayerByLevel(
         this.treeDescription.tierCount - 1
      );
   }

   public findParentBlockLayer(fromLayer: BlockMappedLayerLocator): Optional<BlockMappedLayerLocator>
   {
      if (fromLayer.depth === 0) {
         return Optional.empty();
      }

      return Optional.of(
         this.locatorFactory.findBlockMappedLayerByLevel(fromLayer.level - 1)
      );
   }

   public findChildBlockLevel(fromLayer: BlockMappedLayerLocator): Optional<BlockMappedLayerLocator>
   {
      if (fromLayer.depth >= (this.treeDepth - 1)) {
         return Optional.empty();
      }

      return Optional.of(
         this.locatorFactory.findBlockMappedLayerByLevel(fromLayer.level + 1));
   }

   public findNearestBlockLayer(mapToStorage: MerkleLayerLocator): BlockMappedLayerLocator
   {
      let levelIndex = bs(this.blockMappedRootLayers, mapToStorage.depth, compareSorted);
      if (levelIndex < 0) {
         levelIndex = -1 * (levelIndex + 2);
      }

      return this.locatorFactory.findBlockMappedLayerByLevel(levelIndex);
   }

   public findSiblingDigest(mapToSibling: MerkleDigestLocator): MerkleDigestLocator | undefined
   {
      const siblingPosition = mapToSibling.siblingPosition;

      if (!!siblingPosition) {
         return this.locatorFactory.findDigestByPosition(siblingPosition);
      }

      return undefined;
   }

   public findParentDigest(mapToParent: MerkleDigestLocator): MerkleDigestLocator | undefined
   {
      const parentDepth = mapToParent.depth - 1;
      if (parentDepth < 0) {
         // Root digest parent is undefined.
         return undefined;
      }

      const parentLayer = this.locatorFactory.findLayerByDepth(parentDepth);
      const parentIndex = mapToParent.orientation === MerkleOrientationType.LEFT_CHILD
         ? (
            mapToParent.index / 2
         )
         : (
            (
               mapToParent.index - 1
            ) / 2
         );

      return this.findDigestByLayerAndIndex(parentLayer, parentIndex);
   }

   public findDigestByLayerAndIndex(
      layer: MerkleLayerLocator, digestIndex: number): MerkleDigestLocator
   {
      return this.locatorFactory.findDigestByLayerAndIndex(layer, digestIndex);
   }

   public findDigestByPosition(digestPosition: number): MerkleDigestLocator
   {
      return this.locatorFactory.findDigestByPosition(digestPosition);
   }

   public findDigestByRecordAddress(recordAddress: number): MerkleDigestLocator
   {
      return this.locatorFactory.findDigestByRecordAddress(recordAddress);
   }

   // public findFurthestDescendant(
   //    fromDigest: MerkleDigestLocator, leftMost: boolean = false): MerkleDigestLocator
   // {
   //    const leafLayerSpan = this.treeDescription.treeDepth - fromDigest.depth - 1;
   //    const digestStep = leftMost ? (
   //       1 - Math.pow(2, leafLayerSpan)
   //    ) : (
   //       Math.pow(2, leafLayerSpan) - 1
   //    );
   //    const leafLayer = this.findLeafLayer();
   //
   //    return this.findDigestByLayerAndIndex(
   //       leafLayer, (
   //       (
   //          fromDigest.index + 1
   //       ) * digestStep
   //    ) - 1);
   // }

   public findFurthestDescendant(
      fromDigest: MerkleDigestLocator, leftMost: boolean = false): MerkleDigestLocator
   {
      const descendantPosition = leftMost
         ? fromDigest.leftMostPosition
         : fromDigest.rightMostPosition;

      return this.findDigestByPosition(descendantPosition);
   }

   public findBlockMappedRootByOffset(offset: number): BlockMappedDigestLocator {
      return this.locatorFactory.findBlockMappedDigestByOffset(offset);
   }

   public findNearestBlockMappedRoot(digest: MerkleDigestLocator): BlockMappedDigestLocator
   {
      if (! digest) {
         throw new Error('digest must be defined');
      }

      let currentDigest: MerkleDigestLocator = digest;
      if (! currentDigest.blockMapped) {
         for (currentDigest of this.getDigestPathToRoot(digest)) {
            if (currentDigest.blockMapped) {
               break;
            }
         }
      }

      return currentDigest.asBlockMapped().get();
   }

   public findParentBlockMappedRoot(fromChild: BlockMappedDigestLocator): Optional<BlockMappedDigestLocator> {
      if (fromChild.blockLevel === 0) {
         return Optional.empty();
      }

      return Optional.of(
         this.findNearestBlockMappedRoot(
            this.findParentDigest(fromChild)!
         )
      );
   }

   public findMerkleProofForDigest(subjectDigest: MerkleDigestLocator): MerkleProofLocator
   {
      if (subjectDigest.depth < (this.treeDescription.treeDepth - 1)) {
         throw new Error(`Can only prove digests on the leaf layer, not ${subjectDigest.depth}`);
      }

      let nextParent = this.findParentDigest(subjectDigest) as MerkleDigestLocator;
      let nextSibling = this.findSiblingDigest(subjectDigest) as MerkleDigestLocator;
      let rootDigest = this.findDigestByPosition(0);
      const validationPath: MerkleDigestLocator[] = [];
      const ancestorPath: MerkleDigestLocator[] = [];

      while (nextParent.position !== rootDigest.position) {
         validationPath.push(nextSibling as MerkleDigestLocator);
         nextSibling = this.findSiblingDigest(nextParent) as MerkleDigestLocator;

         ancestorPath.push(nextParent);
         nextParent = this.findParentDigest(nextParent) as MerkleDigestLocator;
      }

      const subjectBlock: BlockMappedDigestLocator =
         this.findNearestBlockMappedRoot(subjectDigest) as BlockMappedDigestLocator;
      const rootBlock: BlockMappedDigestLocator =
         this.findDigestByPosition(0) as BlockMappedDigestLocator;
      const ancestorBlocks: BlockMappedDigestLocator[] = [];
      const siblingBlocks: BlockMappedDigestLocator[] = [];

      if (rootBlock.blockOffset === subjectBlock.blockOffset) {
         let nextAncestorBlock = this.findNearestBlockMappedRoot(
            this.findParentDigest(subjectBlock) as MerkleDigestLocator
         );

         while (nextAncestorBlock.blockOffset !== rootBlock.blockOffset) {
            ancestorBlocks.push(nextAncestorBlock);
            siblingBlocks.push(
               this.findSiblingDigest(nextAncestorBlock) as BlockMappedDigestLocator
            );
            nextAncestorBlock = this.findNearestBlockMappedRoot(
               this.findParentDigest(nextAncestorBlock) as MerkleDigestLocator
            ) as BlockMappedDigestLocator;
         }
      }

      return {
         subjectDigest,
         validationPath,
         ancestorPath,
         subjectBlock,
         rootBlock,
         ancestorBlocks,
         siblingBlocks
      };
   }

}

/*
function labelMany(arg: BlockMappedSubtreeLocator[][])
{
   return arg.map(labelSome)
      .join('; ');
}

function labelSome(arg: BlockMappedSubtreeLocator[])
{
   return arg.map(labelOne)
      .join(', ');
}

function labelOne(element: BlockMappedSubtreeLocator)
{
   if (!element) {
      return '#Undefined#';
   } else if (!element.merkleSubtree) {
      return `#CORRUPTED ${JSON.stringify(element)}#`;
   }

   return `(${element.level}::${element.offset}<${element.merkleSubtree.leftLeafPosition} to ${element.merkleSubtree.rightLeafPosition}>)`;
}
*/

/**
 * Binary search comparator for a search array sorted in increasing value order.
 *
 * @param element
 * @param needle
 */
function compareSorted(element: number, needle: number)
{
   return element - needle;
}
