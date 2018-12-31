import {interfaces} from 'inversify';
import ContainerModule = interfaces.ContainerModule;
import AsyncContainerModule = interfaces.AsyncContainerModule;
import ServiceIdentifier = interfaces.ServiceIdentifier;
import Newable = interfaces.Newable;

export interface IModuleRegistryInternal {
   addContainerModule<T extends AsyncContainerModule>(label: ServiceIdentifier<T>, module: T ): void;
   addContainerModule<T extends ContainerModule>(label: ServiceIdentifier<T>, module: T ): void;
   addContainerModule<T extends (ContainerModule|AsyncContainerModule)>(label: ServiceIdentifier<T>, module: Newable<T> ): void;

   addModuleTemplate<T extends ContainerModule>(label: ServiceIdentifier<T>, factory: Newable<T>): void
}