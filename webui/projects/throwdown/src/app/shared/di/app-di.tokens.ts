import {inject, InjectionToken} from '@angular/core';
import {environment} from '../../../environments/environment';
import {KeycloakOptions} from 'keycloak-angular';
import {KeycloakLoginOptions} from 'keycloak-js';

type EnvironmentTokenNames =
  'baseAssetUrl'
  | 'keycloakConfigPath'
  | 'keycloakServerUrl'
  | 'onLoginRedirectUrl'
  | 'onRegisterRedirectUrl'
  | 'onLogoutRedirectUrl';

function injectFromEnvironment(tokenName: EnvironmentTokenNames): InjectionToken<string> {
  return new InjectionToken<string>(tokenName, {
    providedIn: 'root',
    factory: () => environment[tokenName]
  });
}

export const baseAssetUrl: InjectionToken<string> = injectFromEnvironment('baseAssetUrl');
export const keycloakConfigPath: InjectionToken<string> = injectFromEnvironment('keycloakConfigPath');
export const keycloakServerUrl: InjectionToken<string> = injectFromEnvironment('keycloakServerUrl');
export const onLoginRedirectUrl: InjectionToken<string> = injectFromEnvironment('onLoginRedirectUrl');
export const onRegisterRedirectUrl: InjectionToken<string> = injectFromEnvironment('onRegisterRedirectUrl');
export const onLogoutRedirectUrl: InjectionToken<string> = injectFromEnvironment('onLogoutRedirectUrl');

export const keycloakOptions: InjectionToken<KeycloakOptions> =
  new InjectionToken<KeycloakOptions>('keycloakOptions', {
    providedIn: 'root', // forwardRef(() => CoreModule),
    factory: (): KeycloakOptions => {
      return {
        config: {
          url: inject(keycloakServerUrl), // realms/Throwdown/protocol/openid-connect/auth?client_id=throwdown-webui',
          realm: 'Throwdown',
          clientId: 'throwdown-webui'
        },
        initOptions: {
          // adapter: 'default,'
          // onLoad: 'none',
          flow: 'standard',
          responseMode: 'fragment',
          checkLoginIframe: false
          // checkLoginIframeInterval: 21,
        }
      };
    }
  });

export const keycloakLoginOptions: InjectionToken<KeycloakLoginOptions> =
  new InjectionToken<KeycloakLoginOptions>('KeycloakLoginOptions', {
    providedIn: 'root',
    factory: (): KeycloakLoginOptions => {
      return {
        locale: 'en_US',
        redirectUri: inject(onLoginRedirectUrl),
        scope: 'openid'
      };
    }
  });

export const keycloakRegisterOptions: InjectionToken<KeycloakLoginOptions> =
  new InjectionToken<KeycloakLoginOptions>('KeycloakRegisterOptions', {
    providedIn: 'root',
    factory: (): KeycloakLoginOptions => {
      return {
        action: 'register',
        locale: 'en_US',
        redirectUri: inject(onRegisterRedirectUrl),
        scope: 'openid'
      };
    }
  });

export const keycloakLogoutOptions: InjectionToken<{ redirectUri: string }> =
  new InjectionToken<{ redirectUri: string }>('KeycloakLogoutOptions', {
    providedIn: 'root',
    factory: (): { redirectUri: string } => {
      return {
        redirectUri: inject(onLogoutRedirectUrl)
      };
    }
  });
