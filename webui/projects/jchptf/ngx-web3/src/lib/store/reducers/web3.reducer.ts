import {Web3Actions} from '../actions';
import {Web3Models} from '../models';

export namespace Web3SubFeature
{

  export type State = Web3Models.State;

  export const initialState: Web3Models.State = {
    pollClaimedAccounts: false,
    claimedAccounts: [],
    currentActiveAccount: undefined,
    previousActiveAccount: undefined,
    claimedAccountsInitStatus: Web3Models.ClaimedAccountsInitState.NO_PROVIDER,
    activeClaimedAccountStatus: Web3Models.ActiveClaimedAccountStatus.NO_CLAIMED_ACCOUNTS,
    providerInitStatus: Web3Models.NetworkProviderInitState.PENDING_INITIALIZATION,
    connectedNetwork: undefined,
    customHttpProviderUri: undefined,
    knownAccountsInit: Web3Models.KnownAccountsInitState.NOT_LOADED,
    knownAccountsState: {
      featureDisabled: undefined,
      knownAccounts: []
    },
    pendingActions: []
  };

  export function reducer(state: State = initialState, action: Web3Actions.Actions): State
  {
    switch (action.type) {
      case Web3Actions.ActionTypes.InitBrowserProvider:
      {
        return {
          ...state,
          connectedNetwork: action.payload,
          providerInitStatus: Web3Models.NetworkProviderInitState.BROWSER_CURRENT
        };
      }

      case Web3Actions.ActionTypes.EnableClaimedAccountsPolling:
      {
        return {
          ...state,
          pollClaimedAccounts: true,
          claimedAccountsInitStatus: Web3Models.ClaimedAccountsInitState.POLLING_FOR_INITIAL_LOAD
        };
      }

      case Web3Actions.ActionTypes.DisableClaimedAccountsPolling:
      {
        return {
          ...state,
          pollClaimedAccounts: true
        };
      }

      case Web3Actions.ActionTypes.RefreshClaimedAccountsRequest:
      {
        return {
          ...state,
          claimedAccountsInitStatus: Web3Models.ClaimedAccountsInitState.POLLING_FOR_INITIAL_LOAD
        };
      }

      case Web3Actions.ActionTypes.ResolveClaimedAccounts:
      {
        const claimedAccounts: Web3Models.ClaimedAccount[] = action.payload.map(
          (address: string) => (
            {
              address: address,
              verifiable: false,
              balance: undefined
            }
          )
        );
        const currentActiveAccount =
          action.payload.contains(state.currentActiveAccount)
            ? state.currentActiveAccount
            : action.payload[0];
        const previousActiveAccount =
          (currentActiveAccount === state.currentActiveAccount)
            ? state.previousActiveAccount
            : state.currentActiveAccount;

        return {
          ...state,
          claimedAccountsInitStatus: Web3Models.ClaimedAccountsInitState.POLL_OK,
          claimedAccounts,
          currentActiveAccount,
          previousActiveAccount
        };
      }

      case Web3Actions.ActionTypes.RejectClaimedAccounts:
      {
        return {
          ...state,
          claimedAccountsInitStatus: Web3Models.ClaimedAccountsInitState.POLL_FAILED,
          claimedAccounts: [],
          currentActiveAccount: undefined,
          previousActiveAccount: state.currentActiveAccount
        };
      }

      default:
        return state;
    }
  }
}
