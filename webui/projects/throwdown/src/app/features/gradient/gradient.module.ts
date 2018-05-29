import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {GradientRoutingModule} from './gradient-routing.module';
import {GradientContainerComponent} from './gradient-container/gradient-container.component';

@NgModule({
  imports: [
    SharedModule,
    GradientRoutingModule
  ],
  declarations: [GradientContainerComponent],
  exports: []
})
export class GradientModule { }
