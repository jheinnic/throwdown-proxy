import {APP_INITIALIZER, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LayoutModule} from '@angular/cdk/layout';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';

import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';
import {NgrxCache, NgrxCacheModule} from 'apollo-angular-cache-ngrx';
import {KeycloakAngularModule, KeycloakOptions, KeycloakService} from 'keycloak-angular';

import {SharedModule} from '../shared/shared.module';
import {keycloakOptions} from '../shared/di/app-di.tokens';
import {LayoutComponent} from './layout/layout.component';
import {moduleImportGuard} from './module-import-guard.helper';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // provides HttpClient for HttpLink
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    ApolloModule,
    NgrxCacheModule,
    HttpLinkModule,
    KeycloakAngularModule,
    SharedModule
  ],
  declarations: [LayoutComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitFactory,
      multi: true,
      deps: [keycloakOptions, KeycloakService]
    }
    // {
    //   provide: diTokens.keycloakConfigPath,
    //   useValue: environment.keycloakConfigPath
    // },
    // {
    //   provide: diTokens.baseAssetUrl,
    //   useValue: environment.baseAssetUrl
    // }
  ],
  exports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ApolloModule,
    NgrxCacheModule,
    HttpLinkModule,
    KeycloakAngularModule,
    LayoutComponent
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule, ngrxCache: NgrxCache) {
    moduleImportGuard(parentModule, 'CoreModule');
    // const cache =
    ngrxCache.create({});
  }
}

function keycloakInitFactory(keycloakConfig: KeycloakOptions, keycloak: KeycloakService): () => Promise<any> {
  const asyncResult: Promise<any> = new Promise(async (resolve, reject) => {
    try {
      await keycloak.init(keycloakConfig);
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

  return (): Promise<any> => asyncResult;
}
