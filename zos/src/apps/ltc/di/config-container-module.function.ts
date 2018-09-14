import {interfaces} from 'inversify';
import {LTC_TYPES} from './types';
import {CONFIG_TYPES} from '../../../config/di';
import Bind = interfaces.Bind;
import Context = interfaces.Context;
import {ConfigLoader} from '../../../config/service/config-loader.service';
import {Deployment} from '../config/deployment.config';
import {SetupPolicy} from '../config/setup-policy.config';
import {EventSpecification} from '../config/event-specification.config';

export function configContainerModuleCallback(bind: Bind): void
{
   bind(LTC_TYPES.Deployment)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(Deployment)
         }
      ).inSingletonScope();

   bind(LTC_TYPES.EventSpecification)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(EventSpecification)
         }
      ).inSingletonScope();

   bind(LTC_TYPES.SetupPolicy)
      .toDynamicValue(
         (context: Context) => {
            const configLoader: ConfigLoader =
               context.container.get(CONFIG_TYPES.ConfigLoader)

            return configLoader.getConfig(SetupPolicy)
         }
      ).inSingletonScope();
}