import {NgModule, ModuleWithProviders, APP_INITIALIZER, SkipSelf, Optional, InjectionToken, Inject} from '@angular/core';
import {NgxWeb3Module} from '../ngx-web3.module';

@NgModule({
  imports: [NgxWeb3Module],
  exports: [NgxWeb3Module]
})
class NgxWeb3ForVanillaModule {
}

