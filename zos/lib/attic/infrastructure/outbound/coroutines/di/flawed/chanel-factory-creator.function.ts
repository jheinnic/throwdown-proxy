import {Chanel, chanel, ChanelOptions} from 'chanel';

import {ConcreteFactory} from '../../../di/index';
import {interfaces} from 'inversify';
import {CO_TYPES} from '../types';

export function createChanelFactory<T = any>(_context: interfaces.Context): ConcreteFactory<Chanel<T>, [ChanelOptions, PropertyKey?]> {
   return (options: ChanelOptions, key?: PropertyKey): Chanel<T> => {
      let retVal: Chanel<T>;

      if (!!key) {
         if (_context.container.isBoundNamed(CO_TYPES.ChanelOptions, key)) {
            let prevOptions: ChanelOptions = _context.container.getNamed(CO_TYPES.ChanelOptions, key);
            if ( (options.closed == prevOptions.closed) &&
               (options.concurrency == prevOptions.concurrency) &&
               (options.discard == prevOptions.discard) &&
            (options.open == prevOptions.open)) {
               retVal = _context.container.getNamed(CO_TYPES.Chanel, key);
            } else {
               retVal = chanel<T>(options);
               _context.container.rebind(CO_TYPES.ChanelOptions)
                  .toConstantValue(options)
                  .whenTargetNamed(key);
               _context.container.rebind(CO_TYPES.Chanel)
                  .toConstantValue(options)
                  .whenTargetNamed(key);
            }
         } else {
            retVal = chanel<T>(options);
            _context.container.bind(CO_TYPES.ChanelOptions)
               .toConstantValue(options)
               .whenTargetNamed(key);
            _context.container.bind(CO_TYPES.Chanel)
               .toConstantValue(options)
               .whenTargetNamed(key);
         }
      } else {
         retVal = chanel<T>(options);
      }

      return retVal;
   }
}

export const chanelFactoryCreator: interfaces.FactoryCreator<Chanel<any>> = createChanelFactory;