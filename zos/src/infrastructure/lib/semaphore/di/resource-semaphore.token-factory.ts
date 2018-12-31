import {LoadResourcePoolStrategyConfig} from '../interfaces/load-strategy-config.interface';

let findInputName = function (options: LoadResourcePoolStrategyConfig<T> | string) {
   let name: string;
   if ('string' === typeof options) {
      name = options;
   } else {
      name = options.name;
   }
   return name;
};

export function getResourceSemaphoreToken<T extends object>(options: LoadResourcePoolStrategyConfig<T>|string): string {
   let name = findInputName(options);
   const symbolName = `info.jchein.infrastructure.pool.ResourceSemaphore<${name}>`;
   return symbolName;
}

export function getReservationChannelToken(options: LoadResourcePoolStrategyConfig<any>): symbol
{
   let name = findInputName(options);
   const symbolName = `info.jchein.infrastructure.pool.ReservationChannel<${name}>`;
   return Symbol.for(symbolName);
}

export function getResourceReturnSinkToken(options: LoadResourcePoolStrategyConfig<any>): symbol
{
   let name = findInputName(options);
   const symbolName = `info.jchein.infrastructure.pool.ReturnSink<${name}>`;
   return Symbol.for(symbolName);
}

// export function getResourcePoolToken