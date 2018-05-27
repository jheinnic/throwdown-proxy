// import {Action} from '@ngrx/store';
// import {Subscription} from 'rxjs/subscription';
//
// import {GradientContract} from './gradient-contract.models';
//
// export const STORE_WALLET_SUBSCRIPTION = '[Gradient] Store Wallet Subscription';
// export const CANCEL_WALLET_SUBSCRIPTION = '[Gradient] Cancel Wallet Subscription';
//
// /**
//  * Every action is comprised of at least a type and an optional
//  * payload. Expressing actions as classes enables powerful
//  * type checking in reducer functions.
//  *
//  * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
//  */
// export class SubscribeToWallet implements Action {
//   readonly type = STORE_WALLET_SUBSCRIPTION;
//
//   constructor(public readonly payload: Subscription) {
//   }
// }
//
// export class CancelWalletSubscription implements Action {
//   readonly type = CANCEL_WALLET_SUBSCRIPTION
// }
//
// /**
//  * Export a type alias of all actions in this action group
//  * so that reducers can easily compose action types
//  */
// export type ActionType =
//   SubscribeToWallet |
//   CancelWalletSubscription;
//
