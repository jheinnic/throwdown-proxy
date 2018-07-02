import {NgModule} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {ToymodModule} from './features/toymod/toymod.module';
import {MetaModule} from './features/meta/meta.module';
import {GradientModule} from './features/gradient/gradient.module';
import {NgxRandomArtModule} from '../../../jchptf/ngx-random-art/src/lib/ngx-random-art.module';
import {RootStore, CustomRouterStateSerializerService} from './store';

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
    MetaModule,
    GradientModule,
    ToymodModule,
    NgxRandomArtModule
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
