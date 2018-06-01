import {APP_INITIALIZER, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LayoutModule} from '@angular/cdk/layout';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
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
import {LoggerModule, NGXLogger, NgxLoggerLevel} from 'ngx-logger';

import {SharedModule} from '../shared/shared.module';
import {keycloakOptions} from '../shared/di/keycloak-di.tokens';
import {GradientTokenService} from '../features/gradient/gradient-token.service';
import {LayoutComponent} from './layout/layout.component';
import {moduleImportGuard} from '../utils/module-import-guard.helper';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // provides HttpClient for HttpLink
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF}),
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
      deps: [keycloakOptions, KeycloakService, NGXLogger]
    }, {
      provide: APP_INITIALIZER,
      useFactory: gradientTokenInitFactory,
      multi: true,
      deps: [GradientTokenService, HttpClient, NGXLogger]
    }
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

function keycloakInitFactory(keycloakConfig: KeycloakOptions, keycloak: KeycloakService, logger: NGXLogger): () => Promise<any> {
  // const asyncResult: Promise<any> = new Promise(async (resolve, reject) => {
  //   try {
  keycloak.keycloakEvents$.subscribe((event) => {
    logger.info('Keycloak Event: ', JSON.stringify(event));
  });
  //     await keycloak.init(keycloakConfig);
  //     resolve();
  //   } catch (error) {
  //     console.error(error);
  //     reject(error);
  //   }
  // });
  //
  // return (): Promise<any> => asyncResult;
  return (): Promise<boolean> => keycloak.init(keycloakConfig);
}

function gradientTokenInitFactory(gradientTokenService: GradientTokenService, http: HttpClient, logger: NGXLogger): () => Promise<any> {
  return (): Promise<any> => {
    return http.get('/assets/contracts/GradientToken.json')
      .toPromise()
      .then(
        (resp: Response) => {
          gradientTokenService.setupContract(resp);
        },
        (error: any): void => {
          logger.error('Failed to load GradientToken contract: ', error);
        }
      );
  }
}
