import {injectable, interfaces} from 'inversify';
import ServiceIdentifier = interfaces.ServiceIdentifier;

import {AbstractDIModule} from '../abstract-di-module.class';
import {ModuleRegistry} from '../module-registry.service';
import {ClassDecorator, Constructor} from '../../reflection';
import '../../reflection';

export function diModule<T extends AbstractDIModule>(modSymbol: ServiceIdentifier<T>): ClassDecorator<T> {
   return function classDecorator<T>(constructor: Constructor<T>): void { // Constructor<T> {
      try {
         injectable()(constructor);
      } catch(e) {
         console.warn('Trapped duplicate @injectable annotation for', constructor);
      }
      const diRegistry = ModuleRegistry.getInternal();
      diRegistry.addContainerModule(modSymbol, constructor);

      return;
   }
}

