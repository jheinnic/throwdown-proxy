import {ActionReducerMap, MetaReducer, createFeatureSelector, createSelector} from '@ngrx/store';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromRouter from '@ngrx/router-store';
import * as fromApollo from 'apollo-angular-cache-ngrx';
import {initialState as apolloInitialState} from 'apollo-angular-cache-ngrx/reducer';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 import { storeFreeze } from 'ngrx-store-freeze';
 */

import {RouterStateUrl} from '../shared/model/router-state-url.interface';
import {actionLogger} from './action-logger.function';
import {environment} from '../../environments/environment';

export namespace RootStore
{
  /**
   * We treat each reducer like a table in a database. This means our top level state interface
   * is just a map of keys to inner state types.
   */
  export interface State {
    apollo: fromApollo.CacheState;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  }

  /**
   * The root store definition has need for a feature key
   */
  // export const featureKey = 'root';

  /**
   * Our state is composed of a map of action reducer functions.
   * These reducer functions are called with each dispatched action
   * and the current or initial state and return a new immutable state.
   */
  export const reducerMap: ActionReducerMap<State> = {
    apollo: fromApollo.apolloReducer,
    routerReducer: fromRouter.routerReducer
  };

  export const initialState: Partial<State> = {
    apollo: apolloInitialState,
  };
    // routerReducer: {
    //   state: {
    //     url: '',
    //     queryParams: null,
    //     params: null,
    //     queryParamMap: null,
    //     paramMap: null,
    //     data: null
    //   },
    //   navigationId: 0
    // }
  // };

  /**
   * By default, @ngrx/store uses combineReducers with the reducer map to compose
   * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
   * that will be composed to form the root meta-reducer.
   */
  export const metaReducers: MetaReducer<State>[] = !environment.production ? [actionLogger] : [];

  export const reducerOptions = {
    initialState,
    metaReducers
  };
}

