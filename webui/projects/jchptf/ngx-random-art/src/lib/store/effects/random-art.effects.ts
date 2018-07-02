// import {Inject, Injectable, Optional} from '@angular/core';
// import {Store} from '@ngrx/store';
// import {Actions, Effect} from '@ngrx/effects';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class RandomArtEffects
// {
//   constructor(private actions$: Actions<RandomArtActions.Actions>, private store: Store<any>, private web3Svc: Web3Service,
//     @Inject(web3RefreshBackoff) private readonly accountsRefreshBackoff: Backoff,
//     @Optional() @Inject(NGXLogger) private readonly logger: Pick<NGXLogger, 'info' | 'error'>)
//   {
//     if (!this.logger) {
//       this.logger = {
//         info: console.log,
//         error: console.error
//       };
//     }
//
//     this.onPollDisabled$ = this.actions$.ofType(ActionTypes.DisableClaimedAccountsPolling)
//       .pipe(share());
//     this.onPollEnabled$ = this.actions$.ofType(ActionTypes.EnableClaimedAccountsPolling)
//       .pipe(share());
//
//     this.onAccountsRefreshReady$ =
//       fromEvent(this.accountsRefreshBackoff, 'ready')
//         .pipe(share());
//
//     //   defer(function () {
//     //     this.onAccountRefreshReady.pipe(
//     //       tap(function (value) {
//     //         console.log('Sending action to receive API Call ', value);
//     //         topicIn.next(value);
//     //         console.log('Sent action to receive API Call ', value);
//     //         backoff.backoff();
//     //       }),
//     //       ignoreElements()
//     //     )
//     //
//     //   });
//     // ) {}
//   }
//
//   @Effect()
//   public triggerPollWithBackoff$ = this.onAccountsRefreshReady$.pipe(
//     skipUntil(this.onPollEnabled$),
//     mapTo(new PollClaimedAccountsRequest()),
//     takeUntil(this.onPollDisabled$),
//     repeat()
//   );
//
//   @Effect()
//   public resolveAccountPolling$: Observable<ResolveClaimedAccounts> =
//     this.web3Svc.pollClaimedAccounts()
//       .pipe(
//         delayWhen<string[]>(of, this.actions$.ofType(
//           ActionTypes.EnableClaimedAccountsPolling,
//           ActionTypes.PollClaimedAccountsRequest
//         )),
//         repeat(),
//         distinctUntilChanged(
//           (p: string[], q: string[]) => {
//             this.logger.info('Distinct check:', p, q);
//
//             const retVal = isEqualWith(p, q);
//             if (! retVal) {
//               this.accountsRefreshBackoff.reset();
//             }
//             this.accountsRefreshBackoff.backoff();
//
//             return retVal;
//           }
//         ),
//         map((newAccounts: string[]) => {
//           return new ResolveClaimedAccounts(newAccounts);
//         })
//       );
//
//   /*
// .pip(
// exhaustMap(
//   (value: EnableClaimedAccountsPolling | PollClaimedAccountsRequest): Observable<any> => {
//     return from(
//       this.web3Svc.pollClaimedAccounts()
//     )
//       .pipe(
//         takeUntil(
//         )
//       );
//   }
// ),
// withLatestFrom(
// ),
// );
//
// // this.accountsObservable = defer(this.web3.eth.getAccounts)
// this.accountsObservable = defer(callGetAccounts)
// .do((value: any) => { this.logger.info('Postdefer'); })
// .delayWhen<string[]>(of, this.onRefreshAccounts)
// .repeat()
// .distinctUntilChanged(
// );
// */
//
// }
