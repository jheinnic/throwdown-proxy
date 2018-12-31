import {interfaces} from 'inversify';
import {Queue} from 'co-priority-queue';

import {ConcreteFactory} from '../../../di/index';
import {CO_TYPES} from '../types';

export function createQueueFactory<T = any>(_context: interfaces.Context): ConcreteFactory<Queue<T>, [PropertyKey?]> {
   return (key?: PropertyKey): Queue<T> => {
      let retVal: Queue<T>;

      if (!!key) {
         if (_context.container.isBoundNamed(CO_TYPES.Queue, key)) {
            retVal = _context.container.getNamed(CO_TYPES.Queue, key);
         } else {
            retVal = new Queue<T>();
            _context.container.bind(CO_TYPES.Queue).toConstantValue(retVal).whenTargetNamed(key);
         }
      } else {
         retVal = new Queue<T>();
      }

      return retVal;
   }
}

export const queueFactoryCreator: interfaces.FactoryCreator<Queue<any>> = createQueueFactory;