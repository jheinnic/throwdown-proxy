import {Injectable} from '@angular/core';

import {bindNodeCallback, defer, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import Web3 from 'web3';
import {default as contract} from 'truffle-contract';

import {NGXLogger} from 'ngx-logger';
import {Provider} from 'web3/types';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class Web3Service
{
  private accountsObservable: Observable<string[]>;

  private readonly onInitialized$: BehaviorSubject<boolean>;

  public readonly initialized$: Observable<boolean>;

  private web3: Web3;

  constructor(private logger: NGXLogger)
  {
    this.onInitialized$ = new BehaviorSubject<boolean>(false);
    this.initialized$ = this.onInitialized$.asObservable();
  }

  public injectWeb3Adapter(web3Inst: Web3)
    {
      this.web3 = web3Inst;
      this.accountsObservable = defer(
        bindNodeCallback(this.web3.eth.getAccounts)
      )
        .pipe(
          map(
            (accs: string | string[]): string[] => {
              if (typeof accs === 'string') {
                accs = [accs];
              } else if (!accs || (
                accs.length === 0
              ))
              {
                this.logger.error(`Couldn't get any accounts!  Verify that your Ethereum client (MetaMask) is configured correctly.`, accs);
                accs = [];
              }

              return accs;
            }
          )
        );
      this.onInitialized$.next(true);
  }

  public initTruffleContract<T extends {setProvider(provider: Provider): void; }>(json_artifact: object): T // Web3Types.Contract
  {
    this.assertWeb3Injection();

    // this.logger.info('Contract setup requested for', json_artifact);
    const retVal: T = contract(json_artifact) as T;
    retVal.setProvider(this.web3.currentProvider);
    this.logger.info('Returning contract:', retVal);

    return retVal;
  }

  public pollClaimedAccounts(): Observable<string[]>
  {
    this.assertWeb3Injection();

    return this.accountsObservable;
  }

  private assertWeb3Injection(): void
  {
    if (!this.web3) {
      throw new Error('Web3 dependency must be injected by an APP_INITIALIZER before calling this method');
    }
  }
}
