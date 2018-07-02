import {Action} from '@ngrx/store';
import {Web3Models} from '../models/web3.models';

export namespace Web3Actions
{
  import RetryableError = Web3Models.RetryableError;
  import NonRetryableError = Web3Models.NonRetryableError;

  export enum ActionTypes
  {
    InitBrowserProvider = '[Web3] Init Browser Provider',
    InvalidateCurrentProvider = '[Web3] Invalidate Current Provider',
    RefreshClaimedAccountsRequest = '[Web3] Refresh Claimed Accounts Request',
    ResolveClaimedAccounts = '[Web3] Resolve Claimed Accounts',
    RejectClaimedAccounts = '[Web3] Reject Claimed Accounts',
    EnableClaimedAccountsPolling = '[Web3] Enable Claimed Accounts Polling',
    DisableClaimedAccountsPolling = '[Web3] Disable Claimed Accounts Polling',
    PollClaimedAccountsRequest = '[Web3] Poll Claimed Accounts Request',
    AssignActiveClaimedAccount = '[Web3] Assign Active Claimed Account',
    InvalidateActiveClaimedAccount = '[Web3] Invalidate Active Claimed Account',
    AccountBalanceRequest = '[Web3] Account Balance Request',
    ResolveAccountBalance = '[Web3] Resolve Account Balance',
    RejectAccountBalance = '[Web3] Reject Account Balance',
    LoadKnownAccountsRequest = '[Web3] Load Known Accounts Request',
    ResolveLoadKnownAccounts = '[Web3] Resolve Load Known Accounts',
    ResolveLoadKnownAccountsDisabled = '[Web3] Resolve Load Known Accounts Disabled',
    RejectLoadKnownAccounts = '[Web3] Reject Load Known Accounts',
    AddKnownAccountRequest = '[Web3] Add Known Account Request',
    ResolveAddKnownAccount = '[Web3] Resolve Add Known Account',
    RejectAddKnownAccount = '[Web3] Resolve Add Known Account',
    RemoveKnownAccountRequest = '[Web3] Remove Known Account Request',
    ResolveRemoveKnownAccount = '[Web3] Resolve Remove Known Account',
    RejectRemoveKnownAccount = '[Web3] Resolve Remove Known Account',
    DisableKnownAccounts = '[Web3] Disable Known Accounts',
    ResolveDisableKnownAccounts = '[Web3] Resolve Disable Known Accounts',
    RejectDisableKnownAccounts = '[Web3] Reject Disable Known Accounts'


  }

  export class InitBrowserProvider implements Action
  {
    readonly type = ActionTypes.InitBrowserProvider;

    /**
     * @param {string} payload The network ID of the connected provider.
     */
    constructor(public readonly payload: string)
    {
      if (!this.payload) {
        throw new Error('Provider must have a network ID associated');
      }
    }
  }

  export class EnableClaimedAccountsPolling
  {
    readonly type = ActionTypes.EnableClaimedAccountsPolling;
  }

  export class DisableClaimedAccountsPolling
  {
    readonly type = ActionTypes.DisableClaimedAccountsPolling;
  }

  /*
  export class RefreshClaimedAccountsRequest implements Action
  {
    readonly type = ActionTypes.RefreshClaimedAccountsRequest;
  }
  */

  export class ResolveClaimedAccounts implements Action
  {
    readonly type = ActionTypes.ResolveClaimedAccounts;

    /**
     * @param {string[]} payload Address ID array from request reply.
     */
    constructor(public readonly payload: string[])
    {
    }
  }

  export class RejectClaimedAccounts implements Action
  {
    readonly type = ActionTypes.RejectClaimedAccounts;

    /**
     * @param {string} payload A message to inform user about the failure
     */
    constructor(public readonly payload: RetryableError | NonRetryableError)
    {
    }
  }

  export class PollClaimedAccountsRequest implements Action
  {
    readonly type = ActionTypes.PollClaimedAccountsRequest;
  }

  // TODO
  export class ErrorAction implements Action
  {
    readonly type = ActionTypes.InvalidateActiveClaimedAccount;

    /**
     * @param {string} payload A message to inform user about the failure
     */
    constructor(public readonly payload: RetryableError | NonRetryableError)
    {
    }
  }

  // TODO
  export class InvalidateActiveClaimedAccount implements Action
  {
    readonly type = ActionTypes.InvalidateActiveClaimedAccount;

    /**
     * @param {string} payload The active account that is no longer claimed by
     *                         current Web3 provider.
     */
    constructor(public readonly payload: string)
    {
    }
  }

  export type Actions =
    InitBrowserProvider
    // | RequestClaimedAccountsRefresh
    | PollClaimedAccountsRequest
    | ResolveClaimedAccounts
    | RejectClaimedAccounts
    | EnableClaimedAccountsPolling
    | DisableClaimedAccountsPolling;
}
