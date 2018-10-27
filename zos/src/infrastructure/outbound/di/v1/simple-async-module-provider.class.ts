import {AsynchronousContainerModuleProvider, ContainerModuleDependency} from './interface';
import {interfaces} from 'inversify';

export class SimpleAsyncModuleProvider implements AsynchronousContainerModuleProvider
{
   constructor(
      public readonly key: symbol,
      public readonly moduleCallback: interfaces.AsyncContainerModuleCallBack,
      public readonly moduleDependencies: ReadonlyArray<ContainerModuleDependency<any>> = [])
   { }

   public readonly type: 'Asynchronous' = 'Asynchronous';

}