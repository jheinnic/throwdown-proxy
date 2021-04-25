import {AppBootstrap} from './app-bootstrap.config';
import {
   getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent, LocalProviderToken,
   ModuleIdentifier, TypeIdentifier
} from '@jchptf/nestjs';

export namespace AppConfigConstants {
   export const MODULE_ID: ModuleIdentifier =
      getModuleIdentifier('@jchptf/bootstrap')

   export const APP_BOOTSTRAP: TypeIdentifier<AppBootstrap> =
      getNamedTypeIntent<AppBootstrap>("AppBootstrap");

   export const APP_BOOTSTRAP_PROVIDER_TOKEN: LocalProviderToken<AppBootstrap> =
      getLocalProviderToken<AppBootstrap>(MODULE_ID, APP_BOOTSTRAP);
}
