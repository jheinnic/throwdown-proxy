import {NgModule} from '@angular/core';
import {MetaSenderComponent} from './meta-sender/meta-sender.component';
import {GradientRoutingModule} from './gradient-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    GradientRoutingModule
  ],
  declarations: [MetaSenderComponent],
  exports: [MetaSenderComponent]
})
export class GradientModule { }
