///<reference path="../../../node_modules/@angular/cdk/layout/typings/layout-module.d.ts"/>
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout';
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

import {moduleImportGuard} from './module-import-guard.helper';
import {environment} from '../../environments/environment';
import {diTokens} from '../shared/model/di-tokens.model';
import {LayoutComponent} from './layout/layout.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    RouterModule,
    LayoutModule,
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
    CommonModule,
    SharedModule
  ],
  declarations: [LayoutComponent],
  providers: [
    {
      provide: diTokens.keycloakConfigPath,
      useValue: environment.keycloakConfigPath
    },
    {
      provide: diTokens.baseAssetUrl,
      useValue: environment.baseAssetUrl
    }
  ],
  exports: [
    RouterModule,
    LayoutComponent
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    moduleImportGuard(parentModule, 'CoreModule');
  }
}
