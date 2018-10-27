import {injectable, interfaces} from 'inversify';
import {IModuleRegistryInternal} from '../interfaces/module-registry-internal.interface';
import {AbstractDIModule} from '../v1/abstract-di-module.class';
import {ModuleRegistry} from '../v1/module-registry.service';
import ServiceIdentifier = interfaces.ServiceIdentifier;
import {ClassDecorator, Constructor} from '../../reflection';


export function diTemplate<T extends AbstractDIModule>(identifier: ServiceIdentifier<T>): ClassDecorator<T>
{
   return function (target: Constructor<T>): void {
      try {
         injectable()(target);
      } catch (e) {
         console.warn('Trapped duplicated @injectable annotation for', target);
      }

      const registry: IModuleRegistryInternal = ModuleRegistry.getInternal();
      registry.addModuleTemplate(identifier, target);

      return;
   };
}

