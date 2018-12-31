import {Chan, chanel, ChanOptions} from 'chanel';

import {ConcreteFactory} from '../../../di/index';
import {interfaces} from 'inversify';
import {CO_TYPES} from '../types';

export function createChanFactory<T = any>(_context: interfaces.Context): ConcreteFactory<Chan<T>, [ChanOptions, PropertyKey?]> {
   return (options: ChanOptions, key?: PropertyKey): Chan<T> => {
      let retVal: Chan<T>;

      if (!!key) {
         if (_context.container.isBoundNamed(CO_TYPES.ChanOptions, key)) {
            let prevOptions: ChanOptions = _context.container.getNamed(CO_TYPES.ChanOptions, key);
            if ( (options.closed == prevOptions.closed) &&
               (options.concurrency == prevOptions.concurrency) &&
               (options.discard == prevOptions.discard) &&
            (options.open == prevOptions.open)) {
               retVal = _context.container.getNamed(CO_TYPES.Chan, key);
            } else {
               retVal = chanel<T>(options);
               _context.container.rebind(CO_TYPES.ChanOptions)
                  .toConstantValue(options)
                  .whenTargetNamed(key);
               _context.container.rebind(CO_TYPES.Chan)
                  .toConstantValue(options)
                  .whenTargetNamed(key);
            }
         } else {
            retVal = chanel<T>(options);
            _context.container.bind(CO_TYPES.ChanOptions)
               .toConstantValue(options)
               .whenTargetNamed(key);
            _context.container.bind(CO_TYPES.Chan)
               .toConstantValue(options)
               .whenTargetNamed(key);
         }
      } else {
         retVal = chanel<T>(options);
      }

      return retVal;
   }
}

export const chanelFactoryCreator: interfaces.FactoryCreator<Chan<any>> = createChanFactory;