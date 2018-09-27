import {ClassType, transformAndValidateSync} from 'class-transformer-validator';
import {injectable} from 'inversify';

import {Wild} from '../../lib/index';
import {IConfig} from 'config';
import {configMeta} from '../decorator/config-meta.symbols';
import '../../reflection/index';


@injectable()
export class ConfigLoader {
   private readonly config: IConfig;

   constructor() {
      require('dotenv').config();

      console.log(
`Bootstrapping configuration with:
   ** NODE_CONFIG_DIR=${process.env['NODE_CONFIG_DIR']}
   ** NODE_ENV=${process.env['NODE_ENV']}`);

      this.config = require('config');
   }

   getConfig<T extends {}>(configClass: ClassType<T>, rootPath?: string): T
   {
      const propMap: Map<string, string> =
         Reflect.getMetadata(configMeta.configPropMap, configClass);
      const actualRoot = (!! rootPath)
         ? rootPath
         : Reflect.getMetadata(configMeta.defaultRoot, configClass);

      const resolvedConfig: Wild = {};
      for ( let nextEntry of propMap.entries() ) {
         resolvedConfig[nextEntry[0]] = this.config.get(`${actualRoot}.${nextEntry[1]}`);
      }
      const baseline = new configClass();

      return transformAndValidateSync(
         configClass, Object.assign(baseline, resolvedConfig), {
            validator: {
               forbidUnknownValues: true,
               skipMissingProperties: false
            }});
   }
}

