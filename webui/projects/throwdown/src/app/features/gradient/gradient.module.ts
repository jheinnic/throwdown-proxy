import {APP_INITIALIZER, NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {GradientRoutingModule} from './gradient-routing.module';
import {GradientContainerComponent} from './gradient-container/gradient-container.component';
import {GradientTokenService} from './gradient-token.service';


@NgModule({
  imports: [
    SharedModule,
    GradientRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: gradientTokenInitFactory,
      multi: true,
      deps: [GradientTokenService]
    }
  ],
  declarations: [GradientContainerComponent],
  exports: []
})
export class GradientModule { }

function gradientTokenInitFactory(gradientTokenService: GradientTokenService): () => Promise<boolean>
{
   return () => {
     return gradientTokenService.setupContract();
   };
}
