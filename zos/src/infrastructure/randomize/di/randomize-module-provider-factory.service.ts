import {injectable, interfaces} from 'inversify';
import {CONFIG_TYPES} from '../../config/di';
import {ConfigLoader} from '../../config/service';

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