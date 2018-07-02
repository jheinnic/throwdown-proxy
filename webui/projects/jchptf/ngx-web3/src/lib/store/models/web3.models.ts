export namespace Web3Models {
  export interface ClaimedAccount {
    address: string;
    verifiable: boolean;
    weiBalance: string;
  }

  export interface KnownAccount {
    address: string;
    weiBalance: string;
  }

  export interface KnownAccountsState {
    featureDisabled: boolean;
    knownAccounts: Array<KnownAccount>;
  }

  export enum KnownAccountsInitState {
    NOT_LOADED,
    DISABLED,
    LOADING,
    LOADED
  }

  export enum NetworkProviderInitState {
    PENDING_INITIALIZATION,
    NO_PROVIDER,
    BROWSER_CURRENT,
    DEFAULT_HTTP_FALLBACK,
    CUSTOM_HTTP_FALLBACK
  }

  export enum ClaimedAccountsInitState {
    NO_PROVIDER,
    POLL_IN_PROGRESS,
    // TODO: Use a separate state value to qualify the cause of a LATEST_POLL_REJECTED result instead of
    //       attempting to pack those discriminators into this enum.
    // AUTHORIZATION_REQUIRED,
    LATEST_POLL_REJECTED,
    LATEST_POLL_RESOLVED,
  }

  export enum ActiveClaimedAccountStatus {
    NO_CLAIMED_ACCOUNTS,
    VALID_DEFAULT,
    VALID_SELECTION,
    INVALID_DEFAULT,
    INVALID_SELECTION
  };

  export enum PendingActionKind {
    HANDLE_EVENT,
    SIGN_REQUEST,
    ACCEPT_TRANSFER,
  }

  export interface PendingAction{
    type: PendingActionKind;
  }

  export interface HandlePendingEvent extends PendingAction
  {
    type: PendingActionKind.HANDLE_EVENT;
  }

  export interface SignPendingRequest extends PendingAction
  {
    type: PendingActionKind.SIGN_REQUEST;
  }

  export interface AcceptPendingTransfer extends PendingAction
  {
    type: PendingActionKind.ACCEPT_TRANSFER;
  }

  export type PendingActions = HandlePendingEvent | SignPendingRequest | AcceptPendingTransfer;

  export interface AbstractError {
    message?: string;
  }

  export interface RetryableError extends AbstractError {
    message?: string;
    retryIn: number;
  }

  export interface NonRetryableError extends AbstractError {
    messsage?: string;
  }


  export interface State {
    pollClaimedAccounts: boolean;
    claimedAccounts: ClaimedAccount[];
    currentActiveAccount: ClaimedAccount;
    previousActiveAccount: ClaimedAccount;
    claimedAccountsInitStatus: ClaimedAccountsInitState;
    activeClaimedAccountStatus: ActiveClaimedAccountStatus;
    providerInitStatus: NetworkProviderInitState;
    connectedNetwork: string;
    customHttpProviderUri?: string;
    knownAccountsInit: KnownAccountsInitState;
    knownAccountsState: KnownAccountsState;
    pendingActions: PendingAction[];

  }
}
