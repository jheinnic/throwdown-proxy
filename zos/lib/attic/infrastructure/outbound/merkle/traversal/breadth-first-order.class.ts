import {inject} from 'inversify';
import {BlockMappedDigestLocator, BlockMappedLayerLocator} from '../locator';
import {IMerkleCalculator} from '../interface';
import {MERKLE_TYPES} from '../di';
import {BfsOrderOptions} from '.';

export class BreadthFirstOrder
{
   private readonly layerSpan: number;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly calculator: IMerkleCalculator,
      private readonly orderOptions: BfsOrderOptions)
   {
      this.layerSpan =
         this.orderOptions.leafLayer.blockHeight - this.orderOptions.rootBlock.blockHeight + 1;
      if (this.layerSpan < 1) {
         throw new Error(`Leaf layer height, ${this.orderOptions.leafLayer.blockHeight}, must be at least as deep as the root, ${this.orderOptions.rootBlock.blockHeight}`);
      }
   }

   public* [Symbol.iterator](): IterableIterator<BlockMappedDigestLocator>
   {
      const rootBlock = this.orderOptions.rootBlock;

      let layerIterators: IterableIterator<BlockMappedDigestLocator>[] =
         new Array<IterableIterator<BlockMappedDigestLocator>>(this.layerSpan);
      let currentLevel: BlockMappedLayerLocator = rootBlock.rootLayer;

      for (let ii = 1; ii < this.layerSpan; ii++) {
         currentLevel = this.calculator.findChildBlockLevel(currentLevel).get();
         layerIterators[ii] = this.calculator.getRelatedBlockMappedRootsOnLevel(
            rootBlock, currentLevel, this.orderOptions.leftToRight);
      }
      layerIterators[0] = singleIterator(rootBlock);

      if (!this.orderOptions.topToBottom) {
         layerIterators = layerIterators.reverse();
      }

      for (let ii = 0; ii < this.layerSpan; ii++) {
         yield* layerIterators[ii];
      }
   }
}

function* singleIterator(block: BlockMappedDigestLocator): IterableIterator<BlockMappedDigestLocator> {
   yield block;
}