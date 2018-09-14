import {interfaces} from 'inversify';
import ServiceIdentifier = interfaces.ServiceIdentifier;
import {AbstractDIModule} from '../abstract-di-module.class';

export interface IModuleRegistry {
   loadModule<T extends AbstractDIModule>(moduleLabel: ServiceIdentifier<T>): void;

   expandTemplate<T extends AbstractDIModule>(templateLabel: ServiceIdentifier<T>, ...args: any[]): void

   get<T>(serviceInterface: ServiceIdentifier<T>): T;
}
