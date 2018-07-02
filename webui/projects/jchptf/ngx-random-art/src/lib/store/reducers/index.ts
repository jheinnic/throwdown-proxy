import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';

import {Web3SubFeature as fromWeb3} from './web3.reducer';

export namespace Web3Feature
{
  /**
   * We treat each reducer like a table in a database. This means our top level state interface
   * is just a map of keys to inner state types.
   */
  export interface State
  {
    eth: fromWeb3.State;
  }

  export const featureKey = 'ngx-web3';

  /**
   * Our state is composed of a map of action reducer functions.
   * These reducer functions are called with each dispatched action
   * and the current or initial state and return a new immutable state.
   */
  export const reducerMap: ActionReducerMap<State> = {
    eth: fromWeb3.reducer
  };

  export const initialState: Partial<State> = {
    eth: fromWeb3.initialState,
  };

  export const selectWeb3FeatureState = createFeatureSelector<State>(featureKey);

  /* Sub-Feature Entry Selectors */
  export const selectWeb3SubFeatureState =
    createSelector(selectWeb3FeatureState, (state: State) => {
      return state.eth;
    });

  /* Sub-Feature Delegated Selectors */

  export const selectConnectedNetwork =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.connectedNetwork;
    });

  export const selectWeb3ClaimedAccounts =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.claimedAccounts;
    });

  export const selectClaimedAccountsInitState =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.claimedAccountsInitStatus;
    });

  export const selectKnownAccounts =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.knownAccountsState.knownAccounts;
    });

  export const selectKnownAccountsInitState =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.knownAccountsInit;
    });

  export const selectCurrentActiveAccount =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.currentActiveAccount;
    });

  export const selectPreviousActiveAccount =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.previousActiveAccount;
    });

  export const selectPollClaimedAccountsEnabled =
    createSelector(selectWeb3SubFeatureState, (state: fromWeb3.State) => {
      return state.pollClaimedAccounts;
    });
}
