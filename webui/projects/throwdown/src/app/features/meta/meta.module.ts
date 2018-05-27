import {NgModule} from '@angular/core';
import {MetaSenderComponent} from './meta-sender/meta-sender.component';
import {MetaRoutingModule} from './meta-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    MetaRoutingModule
  ],
  declarations: [MetaSenderComponent],
  exports: [MetaSenderComponent]
})
export class MetaModule { }
