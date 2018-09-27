import {injectable, interfaces} from 'inversify';
import ServiceIdentifier = interfaces.ServiceIdentifier;

import {AbstractDIModule} from '../abstract-di-module.class';
import {ModuleRegistry} from '../module-registry.service';
import {ClassDecorator, Constructor} from '../../reflection/index';
import '../../reflection/index';
import {DI_META} from './di-meta.symbols';

export function diModule<T>(modSymbol: ServiceIdentifier<T>): ClassDecorator<T> {
   return function classDecorator<T>(constructor: Constructor<T>): void { // Constructor<T> {
      try {
         injectable()(constructor);
      } catch(e) {
         console.warn('Trapped duplicate @injectable annotation for', constructor);
      }

      if (! Reflect.hasMetadata(DI_META.syncProviderMethods, constructor)) {
         Reflect.defineMetadata(DI_META.syncProviderMethods, [], constructor);
      }
      if (! Reflect.hasMetadata(DI_META.asyncProviderMethods, constructor)) {
         Reflect.defineMetadata(DI_META.asyncProviderMethods, [], constructor);
      }

      const diRegistry = ModuleRegistry.getInternal();
      diRegistry.addContainerModule(modSymbol, constructor);

      return;
   }
}

