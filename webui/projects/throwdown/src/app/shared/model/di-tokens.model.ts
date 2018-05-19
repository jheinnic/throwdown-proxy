import {InjectionToken} from '@angular/core';

type DITokenNames = 'baseAssetUrl' | 'keycloakConfigPath';

export const diTokens: Record<DITokenNames, InjectionToken<string>> = {
  baseAssetUrl: new InjectionToken<string>('baseAssetUrl'),
  keycloakConfigPath: new InjectionToken<string>('keycloakConfigPath')
};

