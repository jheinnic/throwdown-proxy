import {interfaces} from 'inversify';
import Context = interfaces.Context;
import Bind = interfaces.Bind;

import {CONFIG_TYPES, ConfigLoader} from '../../infrastructure/config';
import {Deployment, EventSpecification, PlayAssets, SetupPolicy} from '../config';
import {APP_CONFIG_TYPES} from './types';


export function configContainerModule(bind: Bind): void
{
   bind(APP_CONFIG_TYPES.Deployment)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(Deployment)
         }
      )
      .inSingletonScope();

   bind(APP_CONFIG_TYPES.EventSpecification)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(EventSpecification)
         }
      )
      .inSingletonScope();

   bind(APP_CONFIG_TYPES.SetupPolicy)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(SetupPolicy)
         }
      )
      .inSingletonScope();

   bind(APP_CONFIG_TYPES.PlayAssets)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(PlayAssets)
         }
      )
      .inSingletonScope();
}

/*
@injectable()
export class ConfigModuleProviderFactory implements ContainerModuleProviderFactory<undefined>
{
   public getModuleProvider(_: undefined = undefined): ContainerModuleProvider
   {
      return new SimpleModuleProvider(
         LTC_APP_MODULES.ConfigurationModule, configContainerModuleCallback);
   }
}
*/