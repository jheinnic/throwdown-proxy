export type Constructor<T> = new(...args: any[]) => T
export type AdaptedConstructor = {
   (target: Function): void;
   (target: Object, propertyKey: string | symbol): void;
};
export interface ClassDecorator<T> {
   (constructor: Constructor<T>): Constructor<T>|void
}
export type ClassDecoratorFactory<T> = (...args: any[]) => ClassDecorator<T>

export type AugmentedConstructor<P, T> = { new(augment: P, ...args: any[]): T }
export type AugmentedClassDecorator<P, T> = (constructor: AugmentedConstructor<P, T>) => AugmentedConstructor<P, T>|void
export type AugmentedClassDecoratorFactory<P, T> = (...args: any[]) => AugmentedClassDecorator<P, T>

// export type QualifiedConstructor<M, T extends M> = { new(id: ServiceIdentifier<T>, ...args: any[]): T }
// export type QualifiedClassDecorator<M, T extends M> = (constructor: Constructor<T>) => void
// export type QualifiedClassDecoratorFactory<M, T extends M> =
//    (id: ServiceIdentifier<T>, ...args: any[]) => Constructor<T>

export type QualifiedConstructor<M, T extends M> = Constructor<T>;
export type QualifiedClassDecorator<M, T extends M> = ClassDecorator<T>;
export type QualifiedClassDecoratorFactory<M, T extends M> = ClassDecoratorFactory<T>;

export type GenericConstructor<T> = new(...args:any[]) => T
export type GenericConstructorFunction<T> = GenericConstructor<T> & Function
export type GenericClassDecorator<T> = (constructor: GenericConstructorFunction<T>) => GenericConstructorFunction<T>|void;
export type GenericClassDecoratorFactory<T> = (...args: any[]) => GenericClassDecorator<T>

