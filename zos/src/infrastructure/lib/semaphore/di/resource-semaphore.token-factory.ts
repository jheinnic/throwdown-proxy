import {LoadResourcePoolStrategyConfig} from '../interfaces/load-strategy-config.interface';

export function getResourceSemaphoreToken<T extends object>(options: LoadResourcePoolStrategyConfig<T>|string): string {
   let name: string;
   if ('string' === typeof options) {
      name = options;
   } else {
      name = options.name;
   }
   const symbolName = `info.jchein.infrastructure.pool.ResourceSemaphore<${name}>`;
   return symbolName;
}

export function getReservationChannelToken(options: LoadResourcePoolStrategyConfig<any>): symbol
{
  const symbolName = `info.jchein.infrastructure.pool.ReservationChannel<${options.name}>`;
  return Symbol.for(symbolName);
}

export function getResourceReturnSinkToken(options: LoadResourcePoolStrategyConfig<any>): symbol
{
   const symbolName = `info.jchein.infrastructure.pool.ReturnSink<${options.name}>`;
   return Symbol.for(symbolName);
}

// export function getResourcePoolToken