import {MerkleDigestLocator} from '../locator';
import {Director} from '../../lib';
import {bindInputParam, buildable, factoryMethod, IBfsOrderBuilder} from './bfs-order-builder.interface';

@buildable
export class BfsOrderOptions
{
   constructor(
      @bindInputParam({name: 'leftToRight'})
      public readonly leftToRight: boolean,
      @bindInputParam({name: 'topToBottom'})
      public readonly topToBottom: boolean,
      @bindInputParam({name: 'startFrom'})
      public readonly startFrom: MerkleDigestLocator,
      @bindInputParam({name: 'endWith'})
      public readonly endWith: MerkleDigestLocator
   )
   { }

   @factoryMethod()
   static create(director: Director<IBfsOrderBuilder>): BfsOrderOptions
   {
      throw director;
   }

   @factoryMethod()
   clone(director: Director<IBfsOrderBuilder>): BfsOrderOptions
   {
      throw director;
   }
}
