import {AsyncContainerModule, Container, ContainerModule, interfaces} from 'inversify';

import ServiceIdentifier = interfaces.ServiceIdentifier;
import {IContainerRegistry} from './interfaces/container-regsitry.interface';

export class ContainerRegistry implements IContainerRegistry
{
   private static readonly INSTANCE: ContainerRegistry = new ContainerRegistry();

   private readonly installerContainer: Container;

   private readonly applicationContainer: Container;

   private constructor()
   {
      this.installerContainer = new Container({
         autoBindInjectable: false,
         defaultScope: 'Singleton',
         skipBaseClassChecks: true
      });
      this.applicationContainer = new Container();
   }

   public static getInstance(): IContainerRegistry
   {
      return this.INSTANCE;
   }

   public get<T>(injectLabel: ServiceIdentifier<T>): T
   {
      return this.applicationContainer.get(injectLabel);
   }

   public registerInstallDependencies(...installerCallback: [interfaces.ContainerModuleCallBack]): void
   {
      this.installerContainer.load(
         ...installerCallback.map(
            function(callback: interfaces.ContainerModuleCallBack): ContainerModule {
               return new ContainerModule(callback);
         }));
   }

   public registerAsyncInstallDependencies(...installerCallback: [interfaces.AsyncContainerModuleCallBack]): Promise<void>
   {
      return this.installerContainer.loadAsync(
         ...installerCallback.map(
            function(callback: interfaces.AsyncContainerModuleCallBack): AsyncContainerModule {
               return new AsyncContainerModule(callback);
            }));
   }

   public registerApplication(applicationLoader: interfaces.ServiceIdentifier<interfaces.ContainerModuleCallBack>): void
   {
      const callback: interfaces.ContainerModuleCallBack = this.installerContainer.get(applicationLoader);
      if (!!callback) {
         throw new Error('Unable to load application callback from installation container');
      }

      this.applicationContainer.load(callback);
   }

}