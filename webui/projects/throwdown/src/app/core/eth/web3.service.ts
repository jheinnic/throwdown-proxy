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
import 'rxjs/add/operator/do';

import isEqualWith from 'lodash.isequalwith';

import Web3 from 'web3';
import * as Web3Types from 'web3/types';
import {default as contract} from 'truffle-contract';

import {NGXLogger} from 'ngx-logger';

import {WindowRefService} from './window-ref.service';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  public accountsObservable: Observable<string[]>;
  private web3: Web3;
  private accounts: string[];
  private onRefreshAccounts = new Subject<any>();

  constructor(private windowRef: WindowRefService, private http: HttpClient, private logger: NGXLogger) {
    this.logger.info("Enter Web3Service Constructor");
    this.setupMetamaskWeb3();
    this.logger.info("Setup MetaMask returned");
    this.refreshAccounts();
    this.logger.info("Account refresh requested");
    this.logger.info("Contract Function", contract);
    this.logger.info("Lodash isEqualWith", isEqualWith);
  }

  public refreshAccounts() {
    this.onRefreshAccounts.next(true);
  }

  public setupContract(json_artifact: any): Web3Types.Contract {
    this.logger.info("Contract setup requested for", contract, json_artifact);
    const retVal /*: TruffleContract*/ = contract(json_artifact);
    retVal.setProvider(this.web3.currentProvider);
    this.logger.info("Returning contract:", retVal, isEqualWith);
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
          if ((! accs) || (accs.length === 0)) {
            this.logger.error(`Couldn't get any accounts!  Verify that your Ethereum client (MetaMask) is configured correctly.`, accs);
            return [];
          }

          if (typeof accs === 'string') {
            accs = [accs];
          }

          return accs;
        }
      );

    // this.accountsObservable = defer(this.web3.eth.getAccounts)
    this.accountsObservable = defer(callGetAccounts)
      .do((value: any) => { this.logger.info("Postdefer");})
      .delayWhen<string[]>(of, this.onRefreshAccounts)
      .repeat()
      .distinctUntilChanged(
        (p: string[], q: string[]) => {
          this.logger.info('Distinct check:', p, q);
          return isEqualWith(p, q)
        }
      );

    this.onRefreshAccounts.next(0);
  }
}
