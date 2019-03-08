import {Director} from '../../../../src/infrastructure/lib';
import {BlockMappedDigestLocator} from '../../infrastructure/merkle';
import {bindInputParam, buildable, factoryMethod, ITopoOrderBuilder} from '../../infrastructure/merkle/traversal/topo-order-builder.interface';
import {TopoOrderOptions} from './topo-order-options.interface';

@buildable
export class BlockTopoOrderOptions implements TopoOrderOptions<BlockMappedDigestLocator>
{
   constructor(
      @bindInputParam({name: 'leftToRight'})
      public readonly leftToRight: boolean,
      @bindInputParam({name: 'breadthFirst'})
      public readonly breadthFirst: boolean,
      @bindInputParam({name: 'startFrom'})
      public readonly startFrom: BlockMappedDigestLocator,
      @bindInputParam({name: 'endWith'})
      public readonly endWith: BlockMappedDigestLocator)
   { }

   @factoryMethod()
   static create(director: Director<ITopoOrderBuilder<BlockMappedDigestLocator>>): BlockTopoOrderOptions
   {
      throw director;
   }

   @factoryMethod()
   clone(director: Director<ITopoOrderBuilder<BlockMappedDigestLocator>>): BlockTopoOrderOptions
   {
      throw director;
   }


}
