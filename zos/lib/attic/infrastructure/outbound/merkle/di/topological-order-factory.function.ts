import {interfaces} from 'inversify';
import {MERKLE_TYPES} from './types';
import {IMerkleCalculator} from '../interface';
import {Director} from '../../lib';
import {ITopoOrderBuilder} from '../traversal';
import {BlockTopologicalOrder} from '../traversal/block-topological-order.class';
import FactoryCreator = interfaces.FactoryCreator;
import Context = interfaces.Context;

export const blockTopologicalOrderFactory: FactoryCreator<BlockTopologicalOrder> =
   (context: Context) => {
      const calculator: IMerkleCalculator = context.container.get(MERKLE_TYPES.MerkleCalculator)
      return (director: Director<ITopoOrderBuilder>): BlockTopologicalOrder => {
         return calculator.getTopoBlockOrder(director);
      };
   };
