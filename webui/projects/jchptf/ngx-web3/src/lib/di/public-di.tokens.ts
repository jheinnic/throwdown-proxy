import {InjectionToken} from '@angular/core';
import {ExponentialOptions} from 'backoff';

/**
 * Optional development-mode injection token for a configurable HTTP Provider URL to
 * use in the event that no Etherium browser has injected a current provider.
 *
 * @type {InjectionToken<string>}
 */
export const web3FallbackHttpProviderUrl: InjectionToken<string> =
  new InjectionToken<string>('WEB3_FALLBACK_HTTP_PROVIDER_URL');

/**
 * Optional injection token for overriding the default exponential backoff timing used
 * to periodically refresh the web3 provider state.
 *
 * @type {InjectionToken<ExponentialOptions>}
 */
export const web3RefreshBackoffOptions: InjectionToken<ExponentialOptions> =
  new InjectionToken<ExponentialOptions>('WEB3_REFRESH_BACKOFF_OPTIONS');
