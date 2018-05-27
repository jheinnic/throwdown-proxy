import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Subject} from 'rxjs/subject';
import {Observable} from 'rxjs/observable';
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback';
import {defer} from 'rxjs/observable/defer';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/map';

import Web3 from 'web3';
import * as Web3Types from 'web3/types';
import {default as contract} from 'truffle-contract';

import {WindowRefService} from '../window/window-ref.service';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  public accountsObservable: Observable<string>;
  private web3: Web3;
  private accounts: string[];
  private onRefreshAccounts = new Subject<any>();

  constructor(private windowRef: WindowRefService, private http: HttpClient) {
    this.setupMetamaskWeb3();
    this.refreshAccounts();
  }

  public refreshAccounts() {
    this.onRefreshAccounts.next(true);
  }

  public setupContract(json_artifact: any): Web3Types.Contract {
    const retVal /*: TruffleContract*/ = contract(json_artifact);
    retVal.setProvider(this.web3.currentProvider);
    return retVal;
  }

  private setupMetamaskWeb3() {
    if (!this.windowRef.nativeWindow) {
      throw new Error('Can not get the window');
    }
    if (!this.windowRef.nativeWindow.web3) {
      throw new Error('Not a metamask browser');
    }
    this.web3 = new Web3(this.windowRef.nativeWindow.web3.currentProvider);

    const callGetAccounts =
      bindNodeCallback(
        this.web3.eth.getAccounts,
        (accs: string[]): string[] => {
          // Get the initial account balance so it can be displayed.
          if (accs.length === 0) {
            alert(`Couldn't get any accounts!  Verify that your Ethereum client (MetaMask) is configured correctly.`);
            return;
          }

          if (typeof accs === 'string') {
            accs = [accs];
          }

          if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
            console.log(`Observed new accounts`);
            this.accounts = accs;
          }

          return accs;
        }
      );
    // this.accountsObservable = defer(callGetAccounts)

    this.accountsObservable = defer(this.web3.eth.getAccounts)
      .delayWhen<string[]>(of, this.onRefreshAccounts)
      .repeat()
      .map((value: any) => value as string)
      .distinctUntilChanged();

    this.onRefreshAccounts.next(0);
  }
}
