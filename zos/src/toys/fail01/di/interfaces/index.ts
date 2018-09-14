// import {interfaces} from 'inversify';
// import ContainerModule = interfaces.ContainerModule;
// // import AsyncContainerModule = interfaces.AsyncContainerModule;
//
// import {ClassDecorator, ClassDecoratorFactory, Constructor} from '../../reflection';
//
// export type DIConstructor<T extends ContainerModule> = Constructor<T>;
// export type DIModuleDecorator<T extends ContainerModule> = ClassDecorator<T>;
// export type DIModuleDecoratorFactory<T extends ContainerModule> = ClassDecoratorFactory<T>;
//
// // export type DIConstructor<T extends AbstractDIModule<T>> = QualifiedConstructor<AbstractDiModule<T>, T>
// // export type DIModuleDecorator<T extends AbstractDIModule<T>> = QualifiedClassDecorator<AbstractDIModule<T>, T>;
// // export type DIModuleDecoratorFactory<T extends AbstractDIModule<T>> = QualifiedClassDecoratorFactory<AbstractDIModule<T>, T>;
//
// // export type DIConstructor<T extends {new(...args:any[]):{}}> = { new(id: ServiceIdentifier<any>, ...args: any[]): T }
// // export type DIConstructor<T extends {new(id: ServiceIdentifier<T>, ...args:any[]):{}}> = T;
// // export type DIClassDecorator<T extends {new(...args:any[]):{}}> =
// //    (id: ServiceIdentifier<T>, constructor: T) => T|void
// // export type DIClassDecoratorFactory<T extends {new(...args:any[]):{}}> =
// //    (id: ServiceIdentifier<T>, constructor: T) => DIClassDecorator<T>
export {IModuleRegistry} from './module-registry.interface';
