import {Container, ContainerModule, interfaces} from 'inversify';

import {IModuleRegistry} from './interfaces/module-registry.interface';
import {IModuleRegistryInternal} from './interfaces/module-registry-internal.interface';
import {AbstractDIModule} from './abstract-di-module.class';
import {AbstractDITemplate} from './interfaces/abstract-di-template.class';
import ServiceIdentifier = interfaces.ServiceIdentifier;
import Newable = interfaces.Newable;
import Context = interfaces.Context;

// import AsyncContainerModule = interfaces.AsyncContainerModule;

export class ModuleRegistry implements IModuleRegistry, IModuleRegistryInternal
{
   private static readonly INSTANCE: ModuleRegistry = new ModuleRegistry();

   // private static readonly CONFIG_TAG: symbol = Symbol.for("configTag");

   private readonly moduleContainer: Container;

   private readonly appContainer: Container;

   private readonly loaded: Set<ServiceIdentifier<any>>;

   private constructor()
   {
      this.moduleContainer = new Container({
         autoBindInjectable: false,
         defaultScope: 'Singleton',
         skipBaseClassChecks: true
      });
      this.appContainer = new Container();
      this.loaded = new Set<ServiceIdentifier<any>>();
   }

   public static getInternal(): IModuleRegistryInternal
   {
      return ModuleRegistry.INSTANCE;
   }

   public static getInternal2(): { module: Container, app: Container }
   {
      return {
         module: ModuleRegistry.INSTANCE.moduleContainer,
         app: ModuleRegistry.INSTANCE.appContainer
      };
   }

   public static getInstance(): IModuleRegistry
   {
      return ModuleRegistry.INSTANCE;
   }

   public addContainerModule<T extends AbstractDIModule>(
      label: ServiceIdentifier<T>, module: Newable<T>): void
   {
      if (this.moduleContainer.isBound(label)) {
         throw Error(`Registry already has a container module registered for ${label.toString()}`);
      }

      this.moduleContainer
         .bind(label)
         .to(module)
         .inSingletonScope();
   }

   public addModuleTemplate<T extends AbstractDIModule>(
      label: ServiceIdentifier<T>, factory: Newable<T>): void
   {
      if (this.moduleContainer.isBound(label)) {
         throw Error(`Registry already has a module template registered for ${label.toString()}`);
      }

      this.moduleContainer
         .bind(label)
         .toFactory((context: Context) => {
            return (modLabel: symbol) => {
               return (...args: any[]) => {
                  if (! context.container.isBound(modLabel)) {
                     context.container.bind(modLabel).toDynamicValue(
                        () => new factory(...args)
                     ).inSingletonScope();
                  }

                  return context.container.get(modLabel);
               }

            }
         });
   }


   public get<T>(injectLabel: ServiceIdentifier<T>): T
   {
      return this.appContainer.get(injectLabel);
   }

   public loadModule<T extends AbstractDIModule>(moduleLabel: ServiceIdentifier<T>): void
   {
      if (!this.moduleContainer.isBound(moduleLabel)) {
         throw Error(`No module registered under ${moduleLabel.toString()}`);
      }

      if (this.loaded.has(moduleLabel)) {
         throw Error(`Registered module under ${moduleLabel.toString()} already loaded`);
      }

      const module: any = this.moduleContainer.get(moduleLabel);
      if (module instanceof AbstractDIModule) {
         this.appContainer.load(
            new ContainerModule(
               module.onLoad.bind(module)));
         this.loaded.add(moduleLabel);
      } else {
         throw Error(`Registered module under ${moduleLabel.toString()} is not synchronous`);
      }
   }

   public expandTemplate<T extends AbstractDIModule>(
      templateLabel: ServiceIdentifier<T>, ...args: any[]): void
   {
      if (!this.moduleContainer.isBound(templateLabel)) {
         throw Error(`No module registered under ${templateLabel.toString()}`);
      }

      const template: (label: symbol) => (...args: any[]) => AbstractDIModule =
         this.moduleContainer.get(templateLabel);
      const moduleLabel = Symbol.for('ExpandedAbstractDIModule');
      const module: AbstractDIModule = template(moduleLabel)(...args);

      this.appContainer.load(
         new ContainerModule(
            module.onLoad.bind(module)));
   }

   /*
    * TODO
   public loadAsyncModule(moduleLabel: ServiceIdentifier<any>): Promise<void>
   {
      if (! this.moduleContainer.isBound(moduleLabel)) {
         throw Error(`No module registered under ${moduleLabel.toString()}`);
      }

      if (this.loaded.has(moduleLabel)) {
         throw Error(`Registered module under ${moduleLabel.toString()} already loaded`);
      }

      const module: any = this.moduleContainer.get(moduleLabel);
      let retVal: Promise<void>;

      if (module instanceof AsyncContainerModule) {
         retVal = this.appContainer.loadAsync(
            new AsyncContainerModule(
               module.onLoad.bind(module)));
         this.loaded.add(moduleLabel);
      } else {
         throw Error(`Registered module under ${moduleLabel.toString()} is not synchronous`);
      }

      return retVal;
   }
   */
}