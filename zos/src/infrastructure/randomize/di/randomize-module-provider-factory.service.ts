import {injectable, interfaces} from 'inversify';
import {CONFIG_TYPES} from '../../outbound/config/di/index';
import {ConfigLoader} from '../../config/service/index';

export function configLoaderModule(bind: interfaces.Bind)
{
   bind(CONFIG_TYPES.ConfigLoader)
      .to(ConfigLoader)
      .inSingletonScope();
}

/*
@injectable()
export class RandomizeModuleProviderFactory implements ContainerModuleProviderFactory<undefined> {
   public getModuleProvider(_: undefined): ContainerModuleProvider
   {
      return new SimpleModuleProvider(configLoaderModule);
   }
}
*/