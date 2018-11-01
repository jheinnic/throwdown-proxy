import {interfaces} from 'inversify';
import {ClassType} from 'class-transformer-validator';

export interface IContainerRegistry {
   registerInstallDependencies( ...installerCallbacks: [interfaces.ContainerModuleCallBack]): void;

   registerAsyncInstallDependencies( ...installerCallbacks: [interfaces.AsyncContainerModuleCallBack]): Promise<void>;

   registerApplication( applicationIdentifier: interfaces.ServiceIdentifier<interfaces.ContainerModuleCallBack> ): void;

   getConfig<T extends {}>(configClass: ClassType<T>, rootPath?: string): T
}