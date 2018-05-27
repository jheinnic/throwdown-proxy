import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MetaSenderComponent} from './meta-sender/meta-sender.component';

const routes: Routes = [
  {
    path: 'meta-sender',
    pathMatch: 'full',
    component: MetaSenderComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradientRoutingModule {
}
