import {ContainerModuleDependency, SynchronousContainerModuleProvider} from './interface';
import {interfaces} from 'inversify';

export class SimpleModuleProvider implements SynchronousContainerModuleProvider
{
   constructor(
      public readonly key: symbol,
      public readonly moduleCallback: interfaces.ContainerModuleCallBack,
      public readonly moduleDependencies: ReadonlyArray<ContainerModuleDependency<any>> = [])
   { }

   public readonly type: 'Synchronous' = 'Synchronous';

}