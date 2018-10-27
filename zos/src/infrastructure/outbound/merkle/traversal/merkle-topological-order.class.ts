import {inject} from 'inversify';

import {MerkleDigestLocator, MerkleLayerLocator, MerkleTreeDescription} from '../locator';
import {IMerkleCalculator} from '../interface';
import {MERKLE_TYPES} from '../di';
import {TopologicalOrder, TopoOrderOptions} from '.';

import '../../reflection';

export class MerkleTopologicalOrder extends TopologicalOrder<MerkleDigestLocator>
{
   protected readonly rootReach: number = 2;
   protected readonly subtreeReach: number = 2;
   protected readonly terminalDepth: number;
   protected readonly usedLeafCount: number;

   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) calculator: IMerkleCalculator,
      @inject(MERKLE_TYPES.MerkleTreeDescription) treeDescription: MerkleTreeDescription,
      traversalOptions: TopoOrderOptions)
   {
      super(calculator, treeDescription, traversalOptions);

      this.terminalDepth = treeDescription.treeDepth - 1;
      this.usedLeafCount = treeDescription.leavesInUse;
   }

   protected getLayers(): IterableIterator<MerkleLayerLocator>
   {
      return this.calculator.getLayers(true);
   }

   protected getNodesOnLayer(
      layer: MerkleLayerLocator, leftToRight: boolean): IterableIterator<MerkleDigestLocator>
   {
      return this.calculator.getDigestsOnLayer(layer, leftToRight);
   }
}