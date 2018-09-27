import {interfaces} from 'inversify';
import ContainerModuleCallBack = interfaces.ContainerModuleCallBack;
import ServiceIdentifier = interfaces.ServiceIdentifier;
import AsyncContainerModuleCallBack = interfaces.AsyncContainerModuleCallBack;

export interface IContainerRegistry {
   registerInstallDependencies( ...installerCallbacks: [ContainerModuleCallBack]): void;

   registerAsyncInstallDependencies( ...installerCallbacks: [AsyncContainerModuleCallBack]): Promise<void>;

   registerApplication( applicationIdentifier: ServiceIdentifier<ContainerModuleCallBack> ): void;
}