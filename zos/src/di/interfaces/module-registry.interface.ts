import {ContainerModule} from 'inversify';

export interface IModuleRegistry {
   loadModule(moduleLabel: Symbol);

   get<T>(injectLabel: Symbol): T;
}

export interface IModuleRegistryInternal {
   addContainerModule( label: Symbol, module: ContainerModule ): any;
}