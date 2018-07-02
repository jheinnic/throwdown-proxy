import {Injectable} from '@angular/core';
import {defer, EMPTY, merge, Observable} from 'rxjs';
import {finalize, share} from 'rxjs/operators';
import {Store} from '@ngrx/store';

import {Web3Feature} from './store/reducers';
import {Web3Models} from './store/models';
import {Web3Actions} from './store/actions';
import ClaimedAccount = Web3Models.ClaimedAccount;

@Injectable({
  providedIn: 'root'
})
export class Web3StoreAdapterService
{
  private readonly selectWeb3ClaimedAccounts$: Observable<Web3Models.ClaimedAccount[]>;

  constructor(private readonly store: Store<any>)
  // @Optional() @Inject(NGXLogger) private readonly logger: Pick<NGXLogger, 'info' | 'error'>)
  {
    // if (!this.logger) {
    //   this.logger = {
    //     info: console.log,
    //     error: console.error
    //   };
    // }
    this.selectWeb3ClaimedAccounts$ =
      merge<ClaimedAccount[]>(
        defer(
          function () {
            this.store.dispatch(new Web3Actions.EnableClaimedAccountsPolling());

            return this.store.select(Web3Feature.selectWeb3ClaimedAccounts)
              .pipe(
                finalize(() => {
                  this.store.dispatch(new Web3Actions.DisableClaimedAccountsPolling());
                })
              );
          }
        )
          .pipe(
            share()
          ),
        EMPTY.pipe(
          finalize(() => {
            this.store.dispatch(new Web3Actions.EnableClaimedAccountsPolling());
          })
        )
      );
  }

  public selectWeb3ClaimedAccounts(): Observable<ClaimedAccount[]>
  {
    return this.selectWeb3ClaimedAccounts$;
  }
}
