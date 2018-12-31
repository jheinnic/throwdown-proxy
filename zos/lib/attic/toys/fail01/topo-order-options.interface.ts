import {LayerFor, MerkleDigestLocator} from '../../infrastructure/merkle';
import {IMerkleCalculator} from '../../infrastructure/merkle';

export interface TopoOrderOptions<Node extends MerkleDigestLocator = MerkleDigestLocator>
{
   getLayers(calculator: IMerkleCalculator): IterableIterator<LayerFor<Node>>;
   getNodesForLayer(calculator: IMerkleCalculator, leftToRight: boolean): IterableIterator<Node>;
   getRootReach(calculator: IMerkleCalculator): number
   getNestedReach(calculator: IMerkleCalculator): number
}
