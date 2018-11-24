import {IConfig} from 'config';
import {injectable} from 'inversify';
import {ClassType, transformAndValidateSync} from 'class-transformer-validator';
import {
   ClassDecoratorFactory, MetadataAccessor, MetadataInspector, PropertyDecoratorFactory
} from '@loopback/metadata';

import '@jchptf/reflection';
import {IConfigLoader} from '@jchptf/di-app-registry';
import {Wild} from '@jchptf/api';

// export type Uses<T, D> = {[K in keyof T]: T[K] extends D ? T[K] : (T[K] extends T ? never : Uses<T[K],D>) }[keyof T];
//
// export interface DD {
//    foo: number;
//    bar: DD[];
//    baz: string;
//    boo: number[];
// }
// export interface EE {
//    f: 4;
// }
// export const c: EE = { f: 4 };
// export const b: Uses<DD, number|string|boolean|DD> = c;
// export type M<T> = {
//    [K in keyof T]: K
// }

@injectable()
export class ConfigLoader implements IConfigLoader {
   private readonly config: IConfig;
   private readonly mapToDefaults: Map<ClassType<any>, any>;

   constructor() {
      require('dotenv').config();

      console.log(
`Bootstrapping configuration with:
   ** NODE_CONFIG_DIR=${process.env['NODE_CONFIG_DIR']}
   ** NODE_ENV=${process.env['NODE_ENV']}`);

      this.config = require('config');
      this.mapToDefaults = new Map<ClassType<any>, any>();
   }

   getConfig<T extends {}>(configClass: ClassType<T>, rootPath?: string): T
   {
      const defaultRoot: ConfigClassMarker | undefined =
         MetadataInspector.getClassMetadata(CONFIG_CLASS_MARKER_KEY, configClass);

      const actualRoot =
         (!! rootPath) ? rootPath
            : ((!! defaultRoot) ? defaultRoot.defaultRoot : undefined);

      const propMap =
         MetadataInspector.getAllPropertyMetadata(
            CONFIG_PROPERTY_MARKER_KEY, configClass.prototype );
      const resolvedConfig: Wild = {};
      if (!! propMap) {
         for (let nextEntry in propMap) {
            const configKey = `${actualRoot}.${propMap[nextEntry].configKey}`;
            resolvedConfig[nextEntry] = this.config.get(configKey);
         }
      }

      let baseline: T = this.mapToDefaults.get(configClass);
      if (! baseline) {
         baseline = new configClass();
         this.mapToDefaults.set(configClass, baseline);
      }

      return transformAndValidateSync(
         configClass, Object.assign({}, baseline, resolvedConfig), {
            validator: {
               forbidUnknownValues: true,
               skipMissingProperties: false
            }
         });
   }
}


interface ConfigClassMarker {
   readonly defaultRoot?: string;
}

const CONFIG_CLASS_MARKER_KEY =
   MetadataAccessor.create<ConfigClassMarker, ClassDecorator>(
      'config-class-marker-key');

export function configClass(defaultRoot?: string) {
   return ClassDecoratorFactory.createDecorator(CONFIG_CLASS_MARKER_KEY, {defaultRoot});
}


interface ConfigPropertyMarker {
   readonly configKey: string;
}

const CONFIG_PROPERTY_MARKER_KEY =
   MetadataAccessor.create<ConfigPropertyMarker, PropertyDecorator>(
      'config-property-marker-key');

export function configProp(configKey: string) {
   return PropertyDecoratorFactory.createDecorator(CONFIG_PROPERTY_MARKER_KEY, {configKey});
}

