// import {
//    MetadataAccessor, MetadataInspector, MetadataKey, MethodDecoratorFactory, ParameterDecoratorFactory
// } from '@loopback/metadata';
// import {Builder, Ctor, IBuilder, Instance} from 'fluent-interface-builder';
//
// import {Director, MixableConstructor} from './index';
// import {isKeyOf, StringKeys} from 'simplytyped';
// import {isString} from 'util';
//
// interface BindToBuilder<S>
// {
//    name: string & keyof S;
//    index?: number;
// }
//
// interface FactoryMethodMarker { }
//
// const FACTORY_METHOD_KEY =
//    MetadataAccessor.create<FactoryMethodMarker, MethodDecorator>(
//       'factory-method-marker-key');
//
//
// interface FluentSetter<T, P extends any[] = any[]>
// {
//    (...args: P): T
// }
//
// export interface FluentBuilder
// {
//    [K: string]: FluentSetter<this>;
// }
//
// type FluentSetterParamTypes<Self extends FluentBuilder, K extends StringKeys<Self> = StringKeys<Self>> =
//    Self[K] extends (...args: infer P) => Self ? P : never;
//
// type FluentBuilderState<Self extends FluentBuilder> = {
//    -readonly [K in StringKeys<Self>]+?: FluentSetterParamTypes<Self, K>
// }
//
// function factoryMethod(): MethodDecorator {
//    return MethodDecoratorFactory.createDecorator<FactoryMethodMarker>(FACTORY_METHOD_KEY, {});
// }
//
// function bindBuilderKey<S>(key: MetadataKey<BindToBuilder<S>, ParameterDecorator>):
//    ((spec: BindToBuilder<S>) => ParameterDecorator)
// {
//    return (spec: BindToBuilder<S>): ParameterDecorator =>
//    {
//       return ParameterDecoratorFactory.createDecorator(key, spec);
//    }
// }
//
// function fluentlyBuildable<S extends FluentBuilder>(key: MetadataKey<BindToBuilder<S>, ParameterDecorator>): any
// {
//    type InternalState = FluentBuilderState<S>
//    type InternalBuilder = S & Instance<InternalState>
//
//    return function <C extends MixableConstructor>(Target: C): C {
//    // return function <TFunction extends Function>(Target: TFunction): TFunction {
//       // function FluentTarget(this: any, ...args: any[]): object {
//       //    Target.apply(this, ...args);
//       //    console.log('constructing ', this);
//       //    return this;
//       // }
//
//       const allParamMeta: BindToBuilder<S>[] | undefined =
//          MetadataInspector.getAllParameterMetadata<BindToBuilder<S>>(key, Target, '');
//       if (!! allParamMeta) {
//          const builder: IBuilder<InternalState, InternalBuilder> =
//             new Builder<InternalState, InternalBuilder>();
//          for (let nextProp of allParamMeta.map(p => p.name)) {
//             // We cannot enforce compile time type checks as we define this, but we define the interface
//             // based on decorators that link to members of an interface that the generated class will
//             // implement, and TypeScript can enforce that use interface at compile time.
//             if (isString(nextProp)) {
//                builder.cascade(nextProp, (args: FluentSetterParamTypes<S>) => (context: InternalState) => {
//                   if (isKeyOf(context, nextProp)) {
//                      context[nextProp] = args;
//                   }
//                });
//             }
//          }
//          const ctor: Ctor<InternalState, InternalBuilder> = builder.value;
//
//          const FluentTarget = class FluentTarget extends Target
//          {
//             static create(director: Director<S>): FluentTarget
//             {
//                let constructorParams: InternalState = {};
//                let builder: InternalBuilder = new ctor(constructorParams);
//                director(builder);
//                // constructorParams = builder.value;
//
//                const paramValues = allParamMeta.map((paramMeta: BindToBuilder<S>) => {
//                   if (isKeyOf(constructorParams, paramMeta.name)) {
//                      const callArgs = constructorParams[paramMeta.name];
//                      if (!!callArgs) {
//                         return callArgs[(
//                            !!paramMeta.index
//                         ) ? paramMeta.index : 0];
//                      }
//                   }
//
//                   return undefined;
//                });
//
//                return new FluentTarget(...paramValues);
//             }
//
//             clone(director: Director<S>): FluentTarget
//             {
//                // Will need to think this if the behavior of the builder is ever in any way
//                // contextual on the previously inherited and newly minted current state, since
//                // it does not currently load the builder with a representation of previous state.
//                const overrides: any = FluentTarget.create(director);
//                for (let prop of Object.getOwnPropertyNames(overrides)) {
//                   if (overrides[prop] === undefined) {
//                      delete overrides[prop];
//                   }
//                }
//                return Object.assign({}, this, overrides);
//             }
//          };
//
//          // newConstructor.prototype = Object.create(Target.prototype);
//          // newConstructor.prototype.constructor = Target;
//
//          const clonePropName: string | undefined =
//             Object.getOwnPropertyNames(Target.prototype)
//                .find((propName: string) => {
//                   if (propName === 'constructor') {
//                      return false;
//                   }
//
//                   // Inspect a class with the key
//                   const factoryMethodData: FactoryMethodMarker | undefined =
//                      MetadataInspector.getMethodMetadata(FACTORY_METHOD_KEY, Target.prototype, propName);
//
//                   // console.log(propName, factoryMethodData);
//                   return !!factoryMethodData;
//                });
//          if (!!clonePropName) {
//             FluentTarget.prototype[clonePropName] = FluentTarget.prototype.clone;
//             // console.log('Found and overrode ' + clonePropName + ' with ' + FluentTarget.prototype.clone);
//          }
//
//          const createPropName: string | undefined =
//             Object.getOwnPropertyNames(Target)
//                .find((propName: string) => {
//                   // Inspect a class with the key
//                   const factoryMethodData: FactoryMethodMarker | undefined =
//                      MetadataInspector.getMethodMetadata(FACTORY_METHOD_KEY, Target, propName);
//
//                   // console.log(propName, factoryMethodData);
//                   return !!factoryMethodData;
//                });
//          if (!!createPropName && (createPropName !== 'create')) {
//             // (FluentTarget as any)[createPropName] = FluentTarget.prototype.constructor.create;
//             if (isKeyOf(FluentTarget, createPropName)) {
//                FluentTarget[createPropName] = FluentTarget.prototype.constructor.create;
//             }
//             FluentTarget.prototype.constructor[createPropName] = FluentTarget.prototype.constructor.create;
//             delete FluentTarget.prototype.constructor.create;
//
//             // console.log('Found and overrode ' + createPropName);
//          }
//
//          return FluentTarget;
//       }
//
//       return Target;
//    }
// }
//
// export interface BuilderDecorators<S>
// {
//    key: MetadataKey<BindToBuilder<S>, ParameterDecorator>;
//    bindInputParam: (spec: BindToBuilder<S>) => ParameterDecorator;
//    factoryMethod: () => MethodDecorator;
//    decorateBuildable: ClassDecorator;
// }
//
// export function getBuilderDecorators<S>(keyName: string): BuilderDecorators<S>
// {
//    const key = MetadataAccessor.create<BindToBuilder<S>, ParameterDecorator>(keyName);
//    const bindInputParam = bindBuilderKey(key);
//    const decorateBuildable = fluentlyBuildable(key);
//    return {
//       key,
//       bindInputParam,
//       factoryMethod,
//       decorateBuildable
//    };
// }
//
