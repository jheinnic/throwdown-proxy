import * as path from 'path');
import {injectable} from 'inversify';
import convict from 'convict';
const makeConvict = require('convict');

import {Selector} from '../../infrastructure/config/service/selector.interface';

@injectable()
export class ProjectDirSelector {
   constructor(
      convictConfig: convict.Schema<Selector>,
      configFilePath: string) {
      let config = makeConvict(convictConfig);
      config.loadFile(configFilePath);

      const env = config.get('env');
      const cfgRoot = config.get('cfgRoot');
      const projDir = config.get('projDir');

      process.env.NODE_ENV = env;
      process.env.NODE_CONFIG_DIR = path.join(cfgRoot, projDir);
   }
}
