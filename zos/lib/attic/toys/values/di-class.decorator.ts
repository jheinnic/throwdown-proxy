import {interfaces} from 'inversify';
import ContainerModule = interfaces.ContainerModule;
import ServiceIdentifier = interfaces.ServiceIdentifier;
import "../../infrastructure/reflection/index";
import {diMeta} from './/di-meta.symbols';

let index: number = 0;

export function diModule<T>(modSymbol: ServiceIdentifier<T>): PropertyDecorator {
   const counter = index++;

   console.log("Counter is", counter);
   // return function classDecorator<T extends Constructor>(constructor: T) {
   //    return constructor;
   // }
   return function (target: Object, propertyKey: string | symbol ) {
      console.log(`Decorating ${target} on ${propertyKey} with ${counter} and ${modSymbol}`);
      let configPropMap = Reflect.getMetadata(configMeta.configPropMap, configProto);
      if (! configPropMap) {
         configPropMap = new Map();
         Reflect.defineMetadata(configMeta.configPropMap, configPropMap, configProto);
      }

      configPropMap.set(propertyKey, configKey);
   };
}

