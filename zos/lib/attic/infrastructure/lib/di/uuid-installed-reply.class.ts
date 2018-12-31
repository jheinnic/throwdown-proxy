import {availableExport, IContainerAccessStrategy} from '@jchptf/di-app-registry';
import {v1, v4} from 'uuid/interfaces';
import {LIB_DI_TYPES} from './types';

export class AvailableV1Method {
   public readonly version: "v1" = "v1";

   @availableExport(LIB_DI_TYPES.UuidFactory, {type: 'none'})
   public readonly method: IContainerAccessStrategy<v1>;

   constructor(method: IContainerAccessStrategy<v1>) {
      this.method = method;
   }
}

export class AvailableV4Method {
   public readonly version: "v4" = "v4";

   @availableExport(LIB_DI_TYPES.UuidFactory, {type: 'none'})
   public readonly method: IContainerAccessStrategy<v4>;

   constructor(
      public readonly diTag: symbol,
      method: IContainerAccessStrategy<v4>
   ) {
      this.method = method;
   }
}

export type AvailableMethod = AvailableV1Method | AvailableV4Method;

export class UuidInstalledReply {
   readonly methods: AvailableMethod[];
}
