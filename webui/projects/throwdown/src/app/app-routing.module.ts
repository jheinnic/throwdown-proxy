import {Component, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatTabsModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {SharedModule} from './shared/shared.module';

@Component({
  selector: 'tdn-route-one',
  template: `
    <h1>Route One View</h1>

    <ng-template tdnNavbarTemplate>
      <mat-tab-group>
        <mat-tab label="Three">
          <h1>Some tab content</h1>
          <p>Giggity</p>
        </mat-tab>
        <mat-tab label="Four">
          <ng-template matTabContent>
            <h1>Some more tab content</h1>
            <p>Goo</p>
            <button (click)="clickMe()" mat-button>Click me!</button>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </ng-template>
  `
})
export class RouteOneComponent {
  public clickMe(): void {
    console.log('Yippy Skippy Peanut Butter');
  }
}

@Component({
  selector: 'tdn-route-two',
  template: `
    <h1>Route Two View</h1>

    <ng-template tdnNavbarTemplate>
      <mat-tab-group>
        <mat-tab>
          <ng-template matTabLabel>Five</ng-template>
          <ng-template matTabContent>Route two link A</ng-template>
        </mat-tab>
        <mat-tab>
          <ng-template matTabLabel>Six</ng-template>
          <ng-template matTabContent>Route two link B</ng-template>
        </mat-tab>
        <mat-tab>
          <ng-template matTabLabel>Seven</ng-template>
          <ng-template matTabContent>Route two link C</ng-template>
        </mat-tab>
      </mat-tab-group>
    </ng-template>
  `
})
export class RouteTwoComponent {
}

const routes: Routes = [

  {
    path: 'route-one',
    component: RouteOneComponent
  },

  {
    path: 'route-two',
    component: RouteTwoComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    SharedModule,
    MatTabsModule
  ],
  declarations: [
    RouteOneComponent,
    RouteTwoComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

