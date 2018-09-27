import {TopologicalOrder} from '../topological-order.class';
import {interfaces} from 'inversify';
import Factory = interfaces.Factory;
import FactoryCreator = interfaces.FactoryCreator;
import Context = interfaces.Context;
import {MERKLE_TYPES} from './types';

export const topologicalOrderFactory: FactoryCreator<TopologicalOrder> =
   (context: Context) => {
      const calculator = context.container..get(MERKLE_TYPES.MerkleCalculator)
   }