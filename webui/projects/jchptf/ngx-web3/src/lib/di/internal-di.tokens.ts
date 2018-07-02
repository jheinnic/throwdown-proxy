import {InjectionToken, inject, InjectFlags} from '@angular/core';
import {Backoff, ExponentialOptions, exponential} from 'backoff';
import {web3RefreshBackoffOptions} from './public-di.tokens';

export const web3RefreshBackoff: InjectionToken<Backoff> = new InjectionToken<Backoff>(
  'WEB3_REFRESH_BACKOFF', {
    providedIn: 'root',
    factory: function(): Backoff {
      const options: ExponentialOptions = inject(web3RefreshBackoffOptions, InjectFlags.Optional) || {
        initialDelay: 800,
        maxDelay: 180000,
        randomisationFactor: 0.25,
        factor: 1.33
      };

      return exponential(options);
    }
  }
);
