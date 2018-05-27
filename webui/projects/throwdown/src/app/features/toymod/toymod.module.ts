import {NgModule} from '@angular/core';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {SharedModule} from '../../shared/shared.module';
import {ToymodRoutingModule} from './toymod-routing.module';
import {RouteOneComponent} from './route-one/route-one.component';
import {RouteTwoComponent} from './route-two/route-two.component';

@NgModule({
  imports: [
    SharedModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
    StoreModule.forFeature('books', reducerMap, {initialState}),
     */

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
    EffectsModule.forFeature([BookEffects, CollectionEffects]),
     */

    ToymodRoutingModule
  ],
  declarations: [RouteOneComponent, RouteTwoComponent]
})
export class ToymodModule {
}
