import {NgModule} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {CoreModule} from './core/core.module';
import {CustomRouterStateSerializerService, initialState, reducerMap, metaReducers} from './store';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {ToymodModule} from './features/toymod/toymod.module';
import {MetaModule} from './features/meta/meta.module';

@NgModule({
  imports: [
    StoreModule.forRoot(reducerMap, {initialState, metaReducers}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'routerReducer'}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    CoreModule,
    SharedModule,
    AppRoutingModule,
    MetaModule,
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
