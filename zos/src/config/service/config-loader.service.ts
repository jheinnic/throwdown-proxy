import {ClassType, transformAndValidateSync} from 'class-transformer-validator';
import {injectable} from 'inversify';
import {IConfig} from 'config';

import {configMeta} from '../decorator/config-meta.symbols';
import '../../reflection';

require('dotenv');

@injectable()
export class ConfigLoader {
   private readonly config: IConfig;

   constructor() {
      // @inject(CONFIG_TYPES.BootstrapSchema) convictConfig: convict.Schema,
      // @inject(CONFIG_TYPES.RootConfigPath) configFilePath: string) {
      // console.log('Config:', convictConfig);
      // console.error('File Path:', configFilePath);
      //
      // let config = makeConvict(convictConfig);
      // config.loadFile(configFilePath);
      //
      // const env = config.get('env');
      // const cfgRoot = config.get('cfgRoot');
      // const projDir = config.get('projDir');

      // process.env['NODE_ENV'] = env;
      // process.env['NODE_CONFIG_DIR'] = path.join(cfgRoot, projDir);
      console.log(`Bootstrapping configuration with:\n** NODE_CONFIG_DIR=${process.env['NODE_CONFIG_DIR']}\n** NODE_ENV=${process.env['NODE_ENV']}`);
      this.config = require('config');
   }

   getConfig<T extends {}>(configClass: ClassType<T>, rootPath?: string): T
   {
      const propMap: Map<string, string> = Reflect.getMetadata(configMeta.configPropMap, configClass);
      const defaultRoot: Map<symbol | string, string> = Reflect.getMetadata(configMeta.defaultRoot, configClass);
      const actualRoot = (!! rootPath) ? rootPath : defaultRoot;

      const resolvedConfig: { [K: string]: any } = {};
      for ( let nextEntry of propMap.entries() ) {
         resolvedConfig[nextEntry[0]] = this.config.get(`${actualRoot}.${nextEntry[1]}`);
      }
      const baseline = new configClass();

      return transformAndValidateSync(
         configClass, Object.assign({}, baseline, resolvedConfig), {
            validator: {
               forbidUnknownValues: true,
               skipMissingProperties: false
            }});
   }
}