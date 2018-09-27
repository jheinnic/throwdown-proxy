import {
   MetadataAccessor, MetadataInspector, MetadataKey, MethodDecoratorFactory, ParameterDecoratorFactory
} from '@loopback/metadata';
import {Builder, Ctor, IBuilder, Instance} from 'fluent-interface-builder';

import {Director, MixableConstructor} from './index';

interface FactoryMethodMarker { }

const FACTORY_METHOD_KEY =
   MetadataAccessor.create<FactoryMethodMarker, MethodDecorator>(
      'factory-method-marker-key');

interface BindToBuilder<S>
{
   name: string & keyof S;
   index?: number;
}

interface FluentSetter<T, P extends any[] = any[]>
{
   (...args: P): T
}

export interface FluentBuilder
{
   [K: string]: FluentSetter<this>;
}

type FluentSetterParamTypes<Self extends FluentBuilder, K extends (string & keyof Self) = (string & keyof Self)> =
   Self[K] extends (...args: infer P) => Self ? P : never;

type FluentBuilderState<Self extends FluentBuilder> = {
   -readonly [K in (string & keyof Self)]+?: FluentSetterParamTypes<Self, K>
}

function factoryMethod(): MethodDecorator {
   return MethodDecoratorFactory.createDecorator<FactoryMethodMarker>(FACTORY_METHOD_KEY, {});
}

function bindBuilderKey<S>(key: MetadataKey<BindToBuilder<S>, ParameterDecorator>):
   ((spec: BindToBuilder<S>) => ParameterDecorator)
{
   return (spec: BindToBuilder<S>): ParameterDecorator =>
   {
      return ParameterDecoratorFactory.createDecorator(key, spec);
   }
}

function fluentlyBuildable<S extends FluentBuilder>(key: MetadataKey<BindToBuilder<S>, ParameterDecorator>): any
{
   type InternalState = FluentBuilderState<S>
   type InternalBuilder = S & Instance<InternalState>

   return function <C extends MixableConstructor>(Target: C): C {
   // return function <TFunction extends Function>(Target: TFunction): TFunction {
      // function FluentTarget(this: any, ...args: any[]): object {
      //    Target.apply(this, ...args);
      //    console.log('constructing ', this);
      //    return this;
      // }

      const allParamMeta: BindToBuilder<S>[] | undefined =
         MetadataInspector.getAllParameterMetadata<BindToBuilder<S>>(key, Target, '');
      if (!allParamMeta) {
         console.error('No metadata to build class.  Aborting!');
         return Target;
      }

      // console.log(`All Param Metadata: ${util.inspect(allParamMeta, true, 10, true)}`);
      // const allTargets = allParamMeta!.map((paramMeta: BindToBuilder<S>) => {
      //    return DecoratorFactory.getTargetName(paramMeta);
      // });
      // console.log(`All Param-mapped Targets: ${util.inspect(allTargets, true, 10, true)}`);
      let counter = 0;
      let oneParamMeta: BindToBuilder<S> | undefined =
         MetadataInspector.getParameterMetadata<BindToBuilder<S>>(key, Target, '', counter);
      while (!!oneParamMeta) {
         // console.log(`Metadata for param ${counter++} is ${util.inspect(oneParamMeta, true, 10, true)}`);
         oneParamMeta =
            MetadataInspector.getParameterMetadata<BindToBuilder<S>>(key, Target, '', counter);
      }

      const propKeys: Set<string & keyof S> = allParamMeta!.reduce(
         (allProps: Set<string & keyof S>, nextMeta: BindToBuilder<S>) => {
            return allProps.add(nextMeta.name);
         }, new Set<string & keyof S>());

      const builder: IBuilder<InternalState, InternalBuilder> = new Builder<InternalState, InternalBuilder>();
      for (let nextProp of propKeys) {
         builder.chain(nextProp, (...args: any[]) => (context: InternalState) => {
            const nextInst: InternalState = {};
            nextInst[nextProp] = <any> args;
            return Object.assign(nextInst, context);
         });
      }
      const ctor: Ctor<InternalState, InternalBuilder> = builder.value;

      const FluentTarget = class FluentTarget extends Target
      {
         static create(director: Director<S>): FluentTarget
         {
            let constructorParams: InternalState = {};
            let builder: InternalBuilder = new ctor(constructorParams);
            director(builder);
            constructorParams = builder.value;
            const paramValues = allParamMeta!.map((paramMeta: BindToBuilder<S>) => {
               const callArgs = constructorParams[paramMeta.name];
               if (!!callArgs) {
                  return callArgs[(!!paramMeta.index) ? paramMeta.index : 0];
               }

               return undefined;
            });

            return new FluentTarget(...paramValues);
         }

         clone(director: Director<S>): FluentTarget
         {
            const overrides: any = FluentTarget.create(director);
            for (let prop of Object.getOwnPropertyNames(overrides)) {
               if (overrides[prop] === undefined) {
                  delete overrides[prop];
               }
            }
            return Object.assign({}, this, overrides);
         }
      };

      // newConstructor.prototype = Object.create(Target.prototype);
      // newConstructor.prototype.constructor = Target;

      const clonePropName: string | undefined =
         Object.getOwnPropertyNames(Target.prototype)
            .find((propName: string) => {
               if (propName === 'constructor') {
                  return false;
               }

               // Inspect a class with the key
               const factoryMethodData: FactoryMethodMarker | undefined =
                  MetadataInspector.getMethodMetadata(FACTORY_METHOD_KEY, Target.prototype, propName);

               // console.log(propName, factoryMethodData);
               return !!factoryMethodData;
            });
      if (!!clonePropName) {
         FluentTarget.prototype[clonePropName] = FluentTarget.prototype.clone;
         // console.log('Found and overrode ' + clonePropName + ' with ' + FluentTarget.prototype.clone);
      }

      const createPropName: string | undefined =
         Object.getOwnPropertyNames(Target)
            .find((propName: string) => {
               // Inspect a class with the key
               const factoryMethodData: FactoryMethodMarker | undefined =
                  MetadataInspector.getMethodMetadata(FACTORY_METHOD_KEY, Target, propName);

               // console.log(propName, factoryMethodData);
               return !!factoryMethodData;
            });
      if (!!createPropName) {
         (FluentTarget as any)[createPropName] = FluentTarget.prototype.constructor.create;

         // console.log('Found and overrode ' + createPropName);
      }

      return FluentTarget;
   }
}

export interface BuilderDecorators<S>
{
   key: MetadataKey<BindToBuilder<S>, ParameterDecorator>;
   bindInputParam: (spec: BindToBuilder<S>) => ParameterDecorator;
   factoryMethod: () => MethodDecorator;
   decorateBuildable: ClassDecorator;
}

export function getBuilderDecorators<S>(keyName: string): BuilderDecorators<S>
{
   const key = MetadataAccessor.create<BindToBuilder<S>, ParameterDecorator>(keyName);
   const bindInputParam = bindBuilderKey(key);
   const decorateBuildable = fluentlyBuildable(key);
   return {
      key,
      bindInputParam,
      factoryMethod,
      decorateBuildable
   };
}

