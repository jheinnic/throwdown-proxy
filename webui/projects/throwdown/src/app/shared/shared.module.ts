///<reference path="../../../node_modules/@angular/router/src/router_module.d.ts"/>
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatTabsModule
} from '@angular/material';
import {LayoutModule} from '@angular/cdk/layout';

import {SiegeDashboardComponent} from './siege-dashboard/siege-dashboard.component';
import {NavbarTemplateDirective} from './navbar/navbar-template.directive';
import {NavbarComponent} from './navbar/navbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NavbarContainerDirective} from './navbar/navbar-container.directive';
import {PortalModule} from '@angular/cdk/portal';
import {RouterModule} from '@angular/router';

// Consider whether NavbarComponent could migrate to CoreModule, leaving NavbarTemplateDirective behind as its public-facing API.
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    FlexLayoutModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule
  ],
  declarations: [
    SiegeDashboardComponent,
    NavbarComponent,
    NavbarContainerDirective,
    NavbarTemplateDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    FlexLayoutModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    SiegeDashboardComponent,
    NavbarTemplateDirective,
    NavbarTemplateDirective,
    NavbarComponent
  ]
})
export class SharedModule {
}
