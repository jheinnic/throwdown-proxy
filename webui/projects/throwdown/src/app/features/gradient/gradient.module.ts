import {APP_INITIALIZER, NgModule} from '@angular/core';

import {SharedModule} from '../../shared/shared.module';
import {GradientRoutingModule} from './gradient-routing.module';
import {GradientContainerComponent} from './gradient-container/gradient-container.component';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
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
      deps: [GradientTokenService, HttpClient, NGXLogger]
    }
  ],
  declarations: [GradientContainerComponent],
  exports: []
})
export class GradientModule { }

function gradientTokenInitFactory(gradientTokenService: GradientTokenService, http: HttpClient, logger: NGXLogger): () => Promise<any> {
  return (): Promise<any> => {
    return http.get('/assets/contracts/GradientToken.json')
      .toPromise()
      .then(
        async (resp: Response): Promise<GradientTokenService> => {
          return await gradientTokenService.setupContract(resp);
        },
        (error: any): void => {
          logger.error('Failed to load GradientToken contract: ', error);
        }
      );
  }
}
