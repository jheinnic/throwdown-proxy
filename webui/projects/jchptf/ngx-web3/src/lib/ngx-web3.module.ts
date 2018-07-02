import {
  NgModule, ModuleWithProviders, APP_INITIALIZER, SkipSelf, Optional, InjectionToken, Inject, inject, InjectFlags
} from '@angular/core';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {Store} from '@ngrx/store';
import {Backoff, ExponentialOptions, exponential} from 'backoff';
import Web3 from 'web3';

import {IndicatorComponent} from './indicator/indicator.component';
import {Web3Service} from './web3.service';

/**
 * Optional development-mode injection token for a configurable HTTP Provider URL to
 * use in the event that no Etherium browser has injected a current provider.
 *
 * @type {InjectionToken<string>}
 */
export const WEB3_FALLBACK_HTTP_PROVIDER_URL: InjectionToken<string> =
  new InjectionToken<string>('WEB3_FALLBACK_HTTP_PROVIDER_URL');

export const WEB3_REFRESH_BACKOFF_OPTIONS: InjectionToken<ExponentialOptions> =
  new InjectionToken<ExponentialOptions>('WEB3_REFRESH_BACKOFF_OPTIONS');

const WEB3_FOR_ROOT_GUARD = new InjectionToken('WEB3_FOR_ROOT_GUARD');

export const WEB3_REFRESH_BACKOFF: InjectionToken<Backoff> = new InjectionToken<Backoff>(
  'WEB3_REFRESH_BACKOFF', {
    providedIn: 'root',
    factory: function(): Backoff {
      const options: ExponentialOptions = inject(WEB3_REFRESH_BACKOFF_OPTIONS, InjectFlags.Optional) || {
        initialDelay: 800,
        maxDelay: 180000,
        randomisationFactor: 0.25,
        factor: 1.33
      };

      return exponential(options);
    }
  }
);

function provideForRootGuard(webModule): string {
  if (webModule) {
    throw new Error(`NgxWeb3Module.forRoot() called twice.  Lazy loaded modules should use NgxWeb3Module.forChild() instead.`);
  }
  return 'guarded';
}

function provideWeb3Initializer(
  web3Svc: Web3Service, store: Store<any>, defaultHttpFallbackUrl: string
): () => Promise<any> {
  return () => new Promise((resolve, reject) => {
    let provider;

    if (typeof window !== 'undefined' && typeof window['web3'] !== 'undefined') {
      // We are in the browser and metamask is running.
      provider = window['web3'].currentProvider;
    } else if (!! defaultHttpFallbackUrl) {
      // We are on the server *OR* the user is not running MetaMask
      provider = new Web3.providers.HttpProvider(defaultHttpFallbackUrl);
    } else {
      provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/foo');
    }

    const web3Inst = new Web3(provider);
    web3Svc.injectWeb3Adapter(web3Inst);

    return resolve(true);
  });
}

@NgModule({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  declarations: [IndicatorComponent],
  exports: [IndicatorComponent]
})
export class NgxWeb3Module {
  static forRoot(parameters: { withNgrx: boolean }): ModuleWithProviders {
    const withNgrx = parameters.withNgrx;

    return {
      // ngModule: withNgrx ? NgxWeb3ForNgrxModule : NgxWeb3ForVanillaModule,
      ngModule: NgxWeb3Module,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: provideWeb3Initializer,
          deps: [Web3Service, [Store, new Optional()], [undefined, new Inject(WEB3_FALLBACK_HTTP_PROVIDER_URL), new Optional()]],
          multi: true
        },
        {
          provide: WEB3_FOR_ROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[NgxWeb3Module, new Optional(), new SkipSelf()]]
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: NgxWeb3Module
    };
  }

  constructor(@Optional() @Inject(WEB3_FOR_ROOT_GUARD) guard: string, @Optional() web3: Web3Service) {
  }
}

