import {
   concat, EMPTY, from, MonoTypeOperatorFunction, Observable, OperatorFunction, range, zip
} from 'rxjs';
import {
   bufferCount, concatAll, flatMap, groupBy, map, mergeMap, shareReplay, skip, take,
   tap, toArray
} from 'rxjs/operators';
import {inject} from 'inversify';

import {IMerkleCalculator} from './merkle-calculator.interface';
import {
   BlockMappedSubtreeLocator, LogicalSubtreeLocator, MerkleDigestLocator, MerkleLayerLocator,
   MerkleProofLocator, MerkleSeriesLocator, MerkleTreeDescription
} from '../../infrastructure/merkle/locator/index';
import {MERKLE_TYPES} from '../../infrastructure/merkle/di/index';
import {IMerkleLocatorFactory} from './record-rotation-builder';
import '../../infrastructure/reflection/index';

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
 * -- Depth is used to plae a
 *
 * === Address, Offset, and Index ===
 *
 * The next set of terms are all ways of identifying a specific record using some measurement of distance.
 *
 * -- Address is used to identify a distinct preImage from the source data set, but does do using the
 *    corresponding location of its initial hash digest relative to the start of the Merkle Tree.  Because
 *    the entire Merkle Tree is not necessarily ever stored all in memory at once, this value is not very
 *    useful for indexed access, but it is often used when forming or updating the membership proof for
 *    an pathTo since its sequence of 0's and 1's will chart out the series of left and and right
 *    traversal steps required to reach targeted digest
 *    -- The Address of a pre-image pathTo and the Offset of its Digest would be the same value, but since
 *       the digests of a Merkle Tree are never really stored in sequential order, we instead use
 *       the term "Address" to defined "that which we cannot have".
 * -- Offset is used to identify an indexed random access into physical storage and is 0-based from the
 *    root node.
 * -- Index provides a Partial Order o
 */
export class MerkleCalculator implements IMerkleCalculator
{
   private merkleLayersByDepth: MerkleLayerLocator[];

   private merkleBlockRootsByDepth: MerkleLayerLocator[];

   public get subtreeDepth(): number
   {
      return this.treeDescription.subtreeDepth;
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

   private readonly layerLocators: Observable<MerkleLayerLocator>;

   private readonly blockMappedLeafLayerLocators: Observable<MerkleLayerLocator>;

   private readonly blockMappedRootLayerLocators: Observable<MerkleLayerLocator>;

   private readonly digestLocators: Observable<MerkleDigestLocator>;

   private treeAssemblyOrder: Observable<BlockMappedSubtreeLocator>;

   // private readonly digestNodesByDepthAndIndex: MerkleDigestLocator[][];

   // private readonly digestNodesByPosition: MerkleDigestLocator[];

   public constructor(
      @inject(MERKLE_TYPES.MerkleTreeDescription)
      public readonly treeDescription: MerkleTreeDescription,
      @inject(MERKLE_TYPES.MerkleLocatorFactory)
      private readonly locatorFactory: IMerkleLocatorFactory
   )
   {
      console.log(treeDescription);

      this.layerLocators = range(0, this.treeDepth)
         .pipe(
            map<number, MerkleLayerLocator>(
               (depth: number) => this.locatorFactory.findLayerByDepth(depth)
            ),
            shareReplay(this.treeDepth)
         );

      const blockMappedRootLayers: (number | MerkleLayerLocator)[] = new Array(this.tierCount);
      const blockMappedLeafLayers: (number | MerkleLayerLocator)[] = new Array(this.tierCount);
      let layerIndex = this.rootSubtreeDepth;
      let nextSubtreeIndex = 1;

      blockMappedRootLayers[0] = 0
      blockMappedLeafLayers[0] = layerIndex - 1;
      while (layerIndex < this.treeDepth) {
         blockMappedRootLayers[nextSubtreeIndex] = layerIndex;
         layerIndex += this.subtreeDepth;
         blockMappedLeafLayers[nextSubtreeIndex++] = layerIndex - 1;
      }

      this.merkleLayersByDepth = new Array(this.treeDepth);
      this.merkleBlockRootsByDepth = new Array(this.treeDepth);

      let latestBlockRoot: MerkleLayerLocator;
      nextSubtreeIndex = 0;

      this.layerLocators.subscribe(
         (layer: MerkleLayerLocator) => {
            this.merkleLayersByDepth[layer.depth] = layer;

            if (layer.depth === blockMappedRootLayers[nextSubtreeIndex]) {
               blockMappedRootLayers[nextSubtreeIndex] = layer;
               latestBlockRoot = layer;
            } else if (layer.depth === blockMappedLeafLayers[nextSubtreeIndex]) {
               blockMappedLeafLayers[nextSubtreeIndex++] = layer;
            } else {
               this.merkleBlockRootsByDepth[layer.depth] = latestBlockRoot;
            }
         }
      );

      this.digestLocators = this.layerLocators.pipe(
         flatMap(
            (layer: MerkleLayerLocator) =>
               range(0, layer.width)
                  .pipe(
                     map((digestIndex: number) =>
                        this.locatorFactory.findDigestByLayerIndex(layer, digestIndex))
                  )
         ),
         shareReplay(Math.pow(2, this.treeDescription.treeDepth + 1) - 1)
      );
      // .subscribe(
      //    (digest: MerkleDigestLocator) => {
      //       this.digestNodesByDepthAndIndex[digest.depth][digest.index] = digest;
      //       this.digestNodesByPosition[digest.position] = digest;
      //    }
      // );

      this.blockMappedRootLayerLocators = from(blockMappedRootLayers as MerkleLayerLocator[]);
      this.blockMappedLeafLayerLocators = from(blockMappedLeafLayers as MerkleLayerLocator[]);

      const mappedLeafSequences =
         concat(
            this.blockMappedLeafLayerLocators
               .pipe(
                  take(1),
                  this.mapLayerToSeriesLocators(this.rootSubtreeWidth),
                  concatAll()
               ),
            this.blockMappedLeafLayerLocators
               .pipe(
                  skip(1),
                  this.mapLayerToSeriesLocators(this.subtreeWidth),
                  concatAll()
               )
         );

      const allStorageBlockLocators: Observable<BlockMappedSubtreeLocator> =
         zip(
            this.blockMappedRootLayerLocators
               .pipe(
                  this.mapLayerToDigestLocators(),
                  concatAll()
               ),
               mappedLeafSequences
         )
            .pipe(
               map<[MerkleDigestLocator, MerkleSeriesLocator], BlockMappedSubtreeLocator>(
                  (pair: [MerkleDigestLocator, MerkleSeriesLocator]): BlockMappedSubtreeLocator =>
                     new BlockMappedSubtreeLocator(
                        this.treeDescription,
                        new LogicalSubtreeLocator(pair[0], pair[1])
                     )
               )
            );

      if (this.treeDescription.tierCount == 1) {
         this.treeAssemblyOrder = allStorageBlockLocators;
      } else {
         this.treeAssemblyOrder =
            allStorageBlockLocators.pipe(
               groupBy<BlockMappedSubtreeLocator, number>(
                  (storageBlockLocator: BlockMappedSubtreeLocator) => storageBlockLocator.level
               ),
               mergeMap((group) => group.pipe(toArray())),
               toArray(),
               /*
               reduce(
                  (groupsArray, group) => {
                     groupsArray[group.key] = group.data;
                     return groupsArray;
                  // (
                  //    subtreeGroupsArray: GroupedObservable<number, BlockMappedSubtreeLocator>[],
                  //    subtreeGroup: GroupedObservable<number, BlockMappedSubtreeLocator>) => {
                  //    subtreeGroupsArray[subtreeGroup.key] = subtreeGroup;
                  //    return subtreeGroupsArray;
                  }, new Array(5)),
               tap((array) => { console.log('Reduction to', array) }),
                  */
               flatMap(
                  (subtreeGroups: BlockMappedSubtreeLocator[][]): Observable<BlockMappedSubtreeLocator> => {
                     let mergedGroups: Observable<BlockMappedSubtreeLocator[]> =
                        from(subtreeGroups[this.tierCount - 1]).pipe(
                           bufferCount(1)
                        );

                     for (let ii = this.tierCount - 2; ii > 0; ii--) {
                        mergedGroups =
                           zip(
                              mergedGroups.pipe(
                                 bufferCount(this.subtreeReach)
                              ),
                              subtreeGroups[ii]
                           )
                              .pipe(
                                 map(
                                    (pair: [BlockMappedSubtreeLocator[][], BlockMappedSubtreeLocator]) => {
                                       const retVal: BlockMappedSubtreeLocator[] = [];
                                       for (let chunk of pair[0]) {
                                          retVal.push.apply(retVal, chunk);
                                       }
                                       retVal.push(pair[1]);
                                       return retVal;
                                    })
                              );
                     }

                     mergedGroups =
                        zip(
                           mergedGroups.pipe(
                              bufferCount(this.treeDescription.rootSubtreeReach)
                           ),
                           subtreeGroups[0]
                        )
                           .pipe(
                              map(
                                 (pair: [BlockMappedSubtreeLocator[][], BlockMappedSubtreeLocator]) => {
                                    const retVal: BlockMappedSubtreeLocator[] = [];
                                    for (let chunk of pair[0]) {
                                       retVal.push.apply(retVal, chunk);
                                    }
                                    retVal.push(pair[1]);
                                    return retVal;
                                 })
                           );

                     return mergedGroups.pipe(
                        concatAll()
                     );
                  }
               )
            );
      }
   }

   public get bitsPerDigest(): number { return this.treeDescription.bitsPerDigest; }

   public get bitsPerIOp(): number { return this.treeDescription.bitsPerIOp; }

   // TODO: Make this an MonoTypeOperatorFunction for MerkleLayerLocator
   public mapDepthToStorageLevel(): MonoTypeOperatorFunction<MerkleLayerLocator>
   {
      // let levelMatch = 0;
      // if (merkleDepth > this.rootSubtreeDepth) {
      //    levelMatch = 1 + Math.floor((merkleDepth - this.rootSubtreeDepth) / this.subtreeDepth);
      // }
      // return this.blockMappedRootLayerLocators.pipe(
      //    first((subtree: BlockMappedSubtreeLocator) => (subtree.level == levelMatch)),
      //    map((subtree: BlockMappedSubtreeLocator) => subtree.rootLayer)
      // );
      return map((layer: MerkleLayerLocator) => this.merkleBlockRootsByDepth[layer.depth]);
   }

   /*
      public mapStorageLevelToRootLayer(storageLevel: number): MerkleLayerLocator { return storageLevel; }

      public mapStorageLevelToLeafDepth(storageLevel: number): MerkleLayerLocator { return storageLevel; }
   */

   public getLayerLocators(): Observable<MerkleLayerLocator>
   {
      return this.layerLocators;
   }

   public mapLayerAndIndexToDigestLocator(): OperatorFunction<[MerkleLayerLocator, number], MerkleDigestLocator>
   {
      return flatMap((depthAndIndex: [MerkleLayerLocator, number]) => {
         const position = depthAndIndex[0].leftPosition + depthAndIndex[1];
         return this.digestLocators.pipe(
            skip(position), take(1));
      });
      // this.digestNodesByDepthAndIndex[depthAndIndex[0]][depthAndIndex[1]]);
   }

   public mapPositionToDigestLocator(): OperatorFunction<number, MerkleDigestLocator>
   {
      // return map((digestPosition: number) => this.digestNodesByPosition[digestPosition]);
      return flatMap((position: number) => {
         return this.digestLocators.pipe(
            skip(position), take(1));
      });
   }

// public getMerkleDigestRunLocators(layerLocator: MerkleLayerLocator, runLength: number): //
// Observable<MerkleSeriesLocator>

   public mapLayerToDigestLocators(): OperatorFunction<MerkleLayerLocator, Observable<MerkleDigestLocator>>
   {
      return map((value: MerkleLayerLocator) => {
         console.log(
            `Forecasting merkle root layer at ${value.depth}`);
         return this.digestLocators.pipe(
            skip(value.leftPosition), take(value.width));

         // return from(this.digestNodesByDepthAndIndex[value.depth]);
      });
   }

   public mapLayerToSeriesLocators(runLength: number): OperatorFunction<MerkleLayerLocator, Observable<MerkleSeriesLocator>>
   {
      return map(
         (value: MerkleLayerLocator) => {
            console.log(`Forecasting merkle leaf layer at ${value.depth}`);
            return range(0, value.width / runLength)
               .pipe(
                  map((seriesIndex: number) => {
                     // TODO: Migrate creation to LocatorFactory and gate it by LRUCache.
                     const leftSpan = seriesIndex * runLength;
                     const rightSpan = leftSpan + runLength - 1;
                     return new MerkleSeriesLocator(value, leftSpan, rightSpan);
                  })
               );
         }
      );
   }

   public mapDigestLocatorToSibling(): MonoTypeOperatorFunction<MerkleDigestLocator>
   {
      // return this.digestNodesByDepthAndIndex[value.depth][value.index + 1];
      return flatMap((digest: MerkleDigestLocator) =>
         this.layerLocators.pipe(
            skip(digest.depth),
            take(1),
            map((layer: MerkleLayerLocator) =>
               ((digest.index % 2) === 1)
                  ? [layer, digest.index + 1]
                  : [layer, digest.index - 1]
            ),
            this.mapLayerAndIndexToDigestLocator()
         )
      );
   }

   public getBlockMappedRootLayerLocators(): Observable<MerkleLayerLocator>
   {
      return this.blockMappedRootLayerLocators;
   }

   public getBlockMappedLeafLayerLocators(): Observable<MerkleLayerLocator>
   {
      return this.blockMappedLeafLayerLocators;
   }

   public getTreeAssemblyBlockOrder(): Observable<BlockMappedSubtreeLocator>
   {
      return this.treeAssemblyOrder;
   }

   public mapRecordAddressToDigestLocator(): OperatorFunction<number, MerkleDigestLocator>
   {
      // TODO: Verify that the delta offset to recordAddress is correct.  It may be off by one...
      // return this.digestNodesByPosition[recordAddress + this.treeDescription.recordToDigestOffset]
      return flatMap((recordAddress: number) => {
         const position = recordAddress + this.treeDescription.recordToDigestOffset;
         return this.digestLocators.pipe(
            skip(position), take(1));
      });
   }

   public mapDigestToMerkleProofLocator(): OperatorFunction<MerkleDigestLocator, MerkleProofLocator>
   {
      // TODO: Implement this!
      // return map((value: MerkleDigestLocator) => {
      //    return undefined;
      // });
      return (source: Observable<MerkleDigestLocator>) => {
         console.log(source);
         return EMPTY;
      }
   }
}

function labelMany(arg: BlockMappedSubtreeLocator[][]) {
   return arg.map(labelSome).join('; ');
}

function labelSome(arg: BlockMappedSubtreeLocator[]) {
   return arg.map(labelOne).join(', ');
}

function labelOne(element: BlockMappedSubtreeLocator) {
   if (! element) {
      return '#Undefined#';
   } else if(! element.merkleSubtree) {
      return `#CORRUPTED ${JSON.stringify(element)}#`;
   }

   return `(${element.level}::${element.offset}<${element.merkleSubtree.leftLeafPosition} to ${element.merkleSubtree.rightLeafPosition}>)`;
}