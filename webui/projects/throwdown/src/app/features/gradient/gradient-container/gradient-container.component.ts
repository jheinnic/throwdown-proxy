import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/subscription';
import {NGXLogger} from 'ngx-logger';

import {Web3Service} from '../../../core/eth/web3.service';
import {GradientToken} from '../gradient-token.interface';
import {GradientTokenService} from '../gradient-token.service';

@Component({
  selector: 'tdn-gradient-container',
  templateUrl: './gradient-container.component.html',
  styleUrls: ['./gradient-container.component.css']
})
export class GradientContainerComponent implements OnInit, OnDestroy {
  @Input() color1: string = '#000000';
  @Input() color2: string = '#FFFFFF';
  accounts: string[];
  metaCoinInstance: GradientToken;
  accountSubscription: Subscription;
  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };
  status = '';

  constructor(
    private web3Service: Web3Service, private gradientTokenService: GradientTokenService,
    private logger: NGXLogger ) {
    this.logger.info('Constructor: ', web3Service, gradientTokenService);
  }

  async ngOnInit() {
    this.metaCoinInstance = await this.gradientTokenService.deployed();
    this.logger.info('About to query accounts with', this.metaCoinInstance);
    this.watchAccount();
  }

  ngOnDestroy() {
    if (!!this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = undefined;
    }
  }

  watchAccount() {
    this.accountSubscription = this.web3Service.accountsObservable.subscribe(
      (accounts: string[]): void => {
        this.logger.info('Accounts', accounts);
        this.accounts = accounts;
        this.model.account = accounts[0];
        // this.model.balance = await this.metaCoinInstance.tokenOfOwnerByIndex(this.model.account, 1);
        this.logger.info('About to refresh with', this.metaCoinInstance);
        this.refreshBalance();
        this.logger.info(this.model.account);
      }
    );
    this.web3Service.refreshAccounts();
  }

  setStatus(status) {
    this.status = status;
  };

  sendCoin() {
    if (!this.metaCoinInstance) {
      this.setStatus('metaCoinInstance is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    this.logger.info('Sending ' + amount + ' coins to ' + receiver);
    this.logger.info('Minting ' + this.color1 + ' -> ' + this.color2);

    this.setStatus('Initiating transaction... (please wait)');

    // this.metaCoinInstance.sendCoin(receiver, amount, {from: this.model.account}).then((success) => {
    this.metaCoinInstance.mint(this.color1, this.color2, {from: this.model.account}).then(
      async (success) => {
      if (!success) {
        this.setStatus('Transaction failed!');
        return -999;
      } else {
        this.setStatus('Transaction complete!');
        return await this.refreshBalance();
      }
    }).catch((e) => {
      this.logger.error('Error sending coin', e);
      this.setStatus('Error sending coin; see log.');
      return -42;
    });
  };

  refreshBalance(): Promise<number> {
    this.logger.info('Refreshing balance');

    return this.metaCoinInstance.tokenOfOwnerByIndex(this.model.account, 1, { from: this.model.account }).then(
      (value: number) => {
        this.logger.info('Found balance: ', value);
        this.model.balance = value.valueOf();
        return value.valueOf();
      }
    ).catch((e: any) => {
      this.logger.error('Failed to refresh balance', e);
      this.setStatus('Error getting balance; see log.');
      return -5000;
    });
  };

  clickAddress(e) {
    this.model.account = e.target.value;
    this.refreshBalance();
  }

  setAmount(e) {
    this.logger.info('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    this.logger.info('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }
}
