import {NgModule} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';

import {CoreModule} from './core/core.module';
// import {CustomRouterStateSerializerService, initialState, reducerMap, metaReducers} from './store';
import {CustomRouterStateSerializerService} from './store';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {ToymodModule} from './features/toymod/toymod.module';
import {MetaModule} from './features/meta/meta.module';
import {GradientModule} from './features/gradient/gradient.module';
import {WalletModule} from './features/wallet/wallet.module';
import { RootStore } from './store';

@NgModule({
  imports: [
    // StoreModule.forRoot(reducerMap, {initialState, metaReducers}),
    StoreModule.forRoot(RootStore.reducerMap, RootStore.reducerOptions),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'routerReducer'}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    WalletModule,
    MetaModule,
    GradientModule,
    ToymodModule
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomRouterStateSerializerService
    }
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
