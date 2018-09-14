import {interfaces} from 'inversify';
import {ConfigLoader} from '../service/config-loader.service';
import {bootstrapSchema} from '../service/bootstrap-schema.object';
import {CONFIG_TYPES} from './types';

export function configLoaderModule(bind: interfaces.Bind)
{
   bind(CONFIG_TYPES.ConfigLoader)
      .to(ConfigLoader)
      .inSingletonScope();
   bind(CONFIG_TYPES.BootstrapSchema)
      .toConstantValue(bootstrapSchema);
}