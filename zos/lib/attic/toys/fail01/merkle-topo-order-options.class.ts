import {Director} from '../../../../src/infrastructure/lib';
import {MerkleDigestLocator} from '../../infrastructure/merkle/locator/index';
import {bindInputParam, buildable, factoryMethod, ITopoOrderBuilder} from '../../infrastructure/merkle/traversal/topo-order-builder.interface';
import {TopoOrderOptions} from './topo-order-options.interface';

@buildable
export class MerkleTopoOrderOptions implements TopoOrderOptions<MerkleDigestLocator>
{
   constructor(
      @bindInputParam({name: 'leftToRight'})
      public readonly leftToRight: boolean,
      @bindInputParam({name: 'breadthFirst'})
      public readonly breadthFirst: boolean,
      @bindInputParam({name: 'startFrom'})
      public readonly startFrom: MerkleDigestLocator,
      @bindInputParam({name: 'endWith'})
      public readonly endWith: MerkleDigestLocator)
   { }

   @factoryMethod()
   static create(
      director: Director<ITopoOrderBuilder<MerkleDigestLocator>>): MerkleTopoOrderOptions
   {
      throw director;
   }

   @factoryMethod()
   clone<Node extends MerkleDigestLocator = MerkleDigestLocator>(
      director: Director<ITopoOrderBuilder<Node>>): TopoOrderOptions<Node>
   {
      throw director;
   }
}
