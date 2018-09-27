import {interfaces} from 'inversify';
import {ConfigLoader} from '../service/index';
import {CONFIG_TYPES} from './types';

export function configLoaderModule(bind: interfaces.Bind)
{
   bind(CONFIG_TYPES.ConfigLoader)
      .to(ConfigLoader)
      .inSingletonScope();
}

/*
export class ConfigLoaderModuleProviderFactory implements ContainerModuleProviderFactory<undefined> {
   public getModuleProvider(_: undefined): ContainerModuleProvider
   {
      return new SimpleModuleProvider(configLoaderModule);
   }
}
*/