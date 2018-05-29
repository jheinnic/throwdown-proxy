import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GradientContainerComponent} from './gradient-container/gradient-container.component';

const routes: Routes = [
  {
    path: 'gradients',
    pathMatch: 'full',
    component: GradientContainerComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradientRoutingModule {
}
