import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RouteOneComponent} from './route-one/route-one.component';
import {RouteTwoComponent} from './route-two/route-two.component';
import {AppAuthGuard} from '../shared/authz/app-auth.guard';

const routes: Routes = [
  {
    path: 'route-one',
    pathMatch: 'full',
    canActivate: [AppAuthGuard],
    component: RouteOneComponent
  },

  {
    path: 'route-two',
    pathMatch: 'full',
    component: RouteTwoComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToymodRoutingModule {
}
