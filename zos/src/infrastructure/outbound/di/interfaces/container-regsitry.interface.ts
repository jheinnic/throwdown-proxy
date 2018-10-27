import {interfaces} from 'inversify';
import ContainerModuleCallBack = interfaces.Container                                                                                                                                                                                                                                                                                                                        ModuleCallBack;
import ServiceIdentifier = interfaces.ServiceIdentifier;
import AsyncContainerModuleCallBack = interfaces.AsyncContainerModuleCallBack;
import {ClassType} from 'class-transformer-validator';

export interface IContainerRegistry {
   registerInstallDependencies( ...installerCallbacks: [ContainerModuleCallBack]): void;

   registerAsyncInstallDependencies( ...installerCallbacks: [AsyncContainerModuleCallBack]): Promise<void>;

   registerApplication( applicationIdentifier: ServiceIdentifier<ContainerModuleCallBack> ): void;

   getConfig<T extends {}>(configClass: ClassType<T>, rootPath?: string): T
}