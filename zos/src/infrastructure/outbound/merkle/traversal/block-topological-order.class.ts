import {inject} from 'inversify';

import {BlockMappedDigestLocator, BlockMappedLayerLocator, MerkleTreeDescription} from '../locator';
import {IMerkleCalculator} from '../interface';
import {MERKLE_TYPES} from '../di';
import {TopoOrderOptions, TopologicalOrder} from '.';

import '../../reflection';

export class BlockTopologicalOrder extends TopologicalOrder<BlockMappedDigestLocator>
{
   protected readonly rootReach: number;
   protected readonly subtreeReach: number;
   protected readonly terminalDepth: number;
   protected readonly usedLeafCount: number;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.MerkleTreeDescription) treeDescription: MerkleTreeDescription,
      traversalOptions: TopoOrderOptions)
   {
      super(calculator, treeDescription, traversalOptions);

      this.rootReach = treeDescription.rootSubtreeReach;
      this.subtreeReach = treeDescription.subtreeReach;
      this.terminalDepth = treeDescription.tierCount - 1;
      this.usedLeafCount = treeDescription.leafBlocksInUse;
   }

   protected getLayers(): IterableIterator<BlockMappedLayerLocator>
   {
      return this.calculator.getBlockMappedLayers(true);
   }

   protected getNodesOnLayer(
      layer: BlockMappedLayerLocator, leftToRight: boolean): IterableIterator<BlockMappedDigestLocator>
   {
      return this.calculator.getSubtreesOnBlockMappedLayer(layer, leftToRight);
   }
}