import {InjectionToken} from '@angular/core';
import {environment} from '../../../environments/environment';
import {EnvironmentTokenNames} from './environment-token-names.type';

export function injectFromEnvironment(tokenName: EnvironmentTokenNames): InjectionToken<string> {
  return new InjectionToken<string>(tokenName, {
    providedIn: 'root',
    factory: () => environment[tokenName]
  });
}

