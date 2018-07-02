import {NgModule, ModuleWithProviders, APP_INITIALIZER, SkipSelf, Optional, InjectionToken, Inject} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {NgxWeb3Module} from '../ngx-web3.module';
import {Web3Feature} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import {Web3Effects} from './effects';

@NgModule({
  imports: [
    NgxWeb3Module,
    StoreModule.forFeature(Web3Feature.featureKey, Web3Feature.reducerMap),
    EffectsModule.forFeature([Web3Effects])
  ],
  providers: [

  ],
  exports: [
    NgxWeb3Module
  ]
})
class NgxWeb3ForNgrxModule {
}

