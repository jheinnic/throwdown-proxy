import {configMeta} from './config-meta.symbols';
import '../../reflection';

export function configProp(configKey: string): PropertyDecorator {
   return (configProto: Object, propertyKey: string | symbol): void => {
      let configPropMap = Reflect.getMetadata(configMeta.configPropMap, configProto.constructor);
      if (! configPropMap) {
         configPropMap = new Map<string, string>();
         Reflect.defineMetadata(configMeta.configPropMap, configPropMap, configProto.constructor);
      }

      configPropMap.set(propertyKey, configKey);
      console.log(propertyKey, configKey);
      return;
   };
}
