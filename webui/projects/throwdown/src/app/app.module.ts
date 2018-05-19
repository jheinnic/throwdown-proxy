import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';

import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';

import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';
import {NgrxCache, NgrxCacheModule} from 'apollo-angular-cache-ngrx';

import {KeycloakAngularModule, KeycloakOptions, KeycloakService} from 'keycloak-angular';

import {CoreModule} from './core/core.module';
import {AppEffects, metaReducers, reducers} from './store';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // provides HttpClient for HttpLink
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
    ApolloModule,
    NgrxCacheModule,
    HttpLinkModule,
    CoreModule,
    SharedModule,
    KeycloakAngularModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitFactory,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
  constructor(ngrxCache: NgrxCache) {
    const cache = ngrxCache.create({});
  }
}

function keycloakInitFactory(keycloak: KeycloakService): () => Promise<any> {
  const keycloakConfig: KeycloakOptions = {
    config: {
      url: 'http://portfolio.dev.jchein.name:28080/auth', // realms/Throwdown/protocol/openid-connect/auth?client_id=throwdown-webui',
      realm: 'Throwdown',
      clientId: 'throwdown-webui'
    },
    initOptions: {
      // onLoad: 'none',
      checkLoginIframe: false,
      flow: 'standard',
      responseMode: 'fragment'
      // checkLoginIframeInterval: 21,
    }
  };

  const asyncResult: Promise<any> =
    new Promise(async (resolve, reject) => {
      try {
        await keycloak.init(keycloakConfig);
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

  return function keycloakInit(): Promise<any> {
    return asyncResult;
  };
}
