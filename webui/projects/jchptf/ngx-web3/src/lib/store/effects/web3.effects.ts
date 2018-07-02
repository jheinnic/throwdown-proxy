import {Inject, Injectable, Optional} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import {fromEvent, of, Observable} from 'rxjs';
import {delayWhen, distinctUntilChanged, map, mapTo, repeat, share, skipUntil, takeUntil} from 'rxjs/operators';

import {NGXLogger} from 'ngx-logger';
import {Backoff} from 'backoff';

import isEqualWith from 'lodash.isequalwith';

import {web3RefreshBackoff} from '../../di/internal-di.tokens';
import {Web3Service} from '../../web3.service';

import {Web3Actions} from '../actions';
import EnableClaimedAccountsPolling = Web3Actions.EnableClaimedAccountsPolling;
import DisableClaimedAccountsPolling = Web3Actions.DisableClaimedAccountsPolling;
import PollClaimedAccountsRequest = Web3Actions.PollClaimedAccountsRequest;
import ActionTypes = Web3Actions.ActionTypes;
import ResolveClaimedAccounts = Web3Actions.ResolveClaimedAccounts;

@Injectable({
  providedIn: 'root'
})
export class Web3Effects
{
  private onPollDisabled$: Observable<DisableClaimedAccountsPolling>;

  private onPollEnabled$: Observable<EnableClaimedAccountsPolling>;

  private onAccountsRefreshReady$: Observable<any>;

  constructor(private actions$: Actions<Web3Actions.Actions>, private store: Store<any>, private web3Svc: Web3Service,
    @Inject(web3RefreshBackoff) private readonly accountsRefreshBackoff: Backoff,
    @Optional() @Inject(NGXLogger) private readonly logger: Pick<NGXLogger, 'info' | 'error'>)
  {
    if (!this.logger) {
      this.logger = {
        info: console.log,
        error: console.error
      };
    }

    this.onPollDisabled$ = this.actions$.ofType(ActionTypes.DisableClaimedAccountsPolling)
      .pipe(share());
    this.onPollEnabled$ = this.actions$.ofType(ActionTypes.EnableClaimedAccountsPolling)
      .pipe(share());

    this.onAccountsRefreshReady$ =
      fromEvent(this.accountsRefreshBackoff, 'ready')
        .pipe(share());

    //   defer(function () {
    //     this.onAccountRefreshReady.pipe(
    //       tap(function (value) {
    //         console.log('Sending action to receive API Call ', value);
    //         topicIn.next(value);
    //         console.log('Sent action to receive API Call ', value);
    //         backoff.backoff();
    //       }),
    //       ignoreElements()
    //     )
    //
    //   });
    // ) {}
  }

  @Effect()
  public triggerPollWithBackoff$ = this.onAccountsRefreshReady$.pipe(
    skipUntil(this.onPollEnabled$),
    mapTo(new PollClaimedAccountsRequest()),
    takeUntil(this.onPollDisabled$),
    repeat()
  );

  @Effect()
  public resolveAccountPolling$: Observable<ResolveClaimedAccounts> =
    this.web3Svc.pollClaimedAccounts()
      .pipe(
        delayWhen<string[]>(of, this.actions$.ofType(
          ActionTypes.EnableClaimedAccountsPolling,
          ActionTypes.PollClaimedAccountsRequest
        )),
        repeat(),
        distinctUntilChanged(
          (p: string[], q: string[]) => {
            this.logger.info('Distinct check:', p, q);

            const retVal = isEqualWith(p, q);
            if (! retVal) {
              this.accountsRefreshBackoff.reset();
            }
            this.accountsRefreshBackoff.backoff();

            return retVal;
          }
        ),
        map((newAccounts: string[]) => {
          return new ResolveClaimedAccounts(newAccounts);
        })
      );

  /*
.pip(
exhaustMap(
  (value: EnableClaimedAccountsPolling | PollClaimedAccountsRequest): Observable<any> => {
    return from(
      this.web3Svc.pollClaimedAccounts()
    )
      .pipe(
        takeUntil(
        )
      );
  }
),
withLatestFrom(
),
);

// this.accountsObservable = defer(this.web3.eth.getAccounts)
this.accountsObservable = defer(callGetAccounts)
.do((value: any) => { this.logger.info('Postdefer'); })
.delayWhen<string[]>(of, this.onRefreshAccounts)
.repeat()
.distinctUntilChanged(
);
*/

}
