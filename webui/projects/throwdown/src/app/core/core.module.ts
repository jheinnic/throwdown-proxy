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

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';
import {NgrxCache, NgrxCacheModule} from 'apollo-angular-cache-ngrx';
import {LoggerModule, NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {KeycloakAngularModule, KeycloakOptions, KeycloakService} from 'keycloak-angular';
import {CloudinaryModule} from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';

import {moduleImportGuard} from '../utils/module-import-guard.helper';
import {keycloakOptions} from '../shared/di/keycloak-di.tokens';
import {LayoutComponent} from './layout/layout.component';
import {SharedModule} from '../shared/shared.module';
import {NgxWeb3Module} from '../../../../jchptf/ngx-web3/src/lib/ngx-web3.module';
import {NgxMessageChannelsModule} from '../../../../jchptf/ngx-message-channels/src/lib/ngx-message-channels.module';
import {CoreFeature, LayoutEffects, ToymodEffects} from './store';
import {environment} from '../../environments/environment';


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
    SharedModule,
    ApolloModule,
    NgrxCacheModule,
    HttpLinkModule,
    KeycloakAngularModule,
    CloudinaryModule.forRoot(Cloudinary, {
      cloud_name: environment.cloudinaryCloudName,
      upload_preset: environment.cloudinaryUploadPreset
    }),
    NgxWeb3Module.forRoot({withNgrx: true}),
    NgxMessageChannelsModule,
    StoreModule.forFeature(CoreFeature.featureKey, CoreFeature.reducerMap, { initialState: CoreFeature.initialState }),
    EffectsModule.forFeature([LayoutEffects, ToymodEffects])
  ],
  declarations: [LayoutComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitFactory,
      multi: true,
      deps: [keycloakOptions, KeycloakService, NGXLogger]
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

// function gradientTokenInitFactory(gradientTokenService: GradientTokenService, http: HttpClient, logger: NGXLogger): () => Promise<any> {
//   return (): Promise<any> => {
//     return http.get('/assets/contracts/GradientToken.json')
//       .toPromise()
//       .then(
//         (resp: Response) => {
//           gradientTokenService.setupContract(resp);
//         },
//         (error: any): void => {
//           logger.error('Failed to load GradientToken contract: ', error);
//         }
//       );
//   }
// }
