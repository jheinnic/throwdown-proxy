import {interfaces} from 'inversify';

export type ContainerModuleKind = 'Asynchronous' | 'Synchronous';

export enum ContainerModuleType
{
   Asynchronous = 'Asynchronous',
   Synchronous = 'Synchronous'
}

export interface SynchronousContainerModuleProvider
{
   readonly type: 'Synchronous';
   readonly key: symbol;
   readonly moduleCallback: interfaces.ContainerModuleCallBack;
   readonly moduleDependencies: ReadonlyArray<ContainerModuleDependency<any>>
}

export interface AsynchronousContainerModuleProvider
{
   readonly type: 'Asynchronous';
   readonly key: symbol;
   readonly moduleCallback: interfaces.AsyncContainerModuleCallBack;
   readonly moduleDependencies: ReadonlyArray<ContainerModuleDependency<any>>
}

export type ContainerModuleProvider =
   SynchronousContainerModuleProvider
   | AsynchronousContainerModuleProvider;

export interface ContainerModuleProviderFactory<B>
{
   getModuleProvider(params: B): ContainerModuleProvider
}

export interface ContainerModuleDependency<B> {
   readonly providerType: ContainerModuleType;
   readonly providerFactory: ContainerModuleProviderFactory<B>
   readonly paramValue: B;
}

// export interface ContainerModuleInjector<B> {
//    inject()
// }