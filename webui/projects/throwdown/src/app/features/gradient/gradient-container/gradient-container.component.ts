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
        this.accounts = accounts;
        this.model.account = accounts[0];
        // this.model.balance = await this.metaCoinInstance.tokenOfOwnerByIndex(this.model.account, 1);
        this.refreshBalance();
        this.logger.info(this.model.account);
      }
    );
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
    this.metaCoinInstance.mint(this.color1, this.color2, {from: this.model.account}).then((success) => {
      if (!success) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      }
    }).catch((e) => {
      this.logger.info(e);
      this.setStatus('Error sending coin; see log.');
    });

  };

  refreshBalance() {
    this.logger.info('Refreshing balance');

    this.metaCoinInstance.tokenOfOwnerByIndex(this.model.account, 1).then(
      (value) => {
        this.logger.info('Found balance: ', value);
        this.model.balance = value.valueOf();
      }
    ).catch(function (e) {
      this.logger.error(e);
      this.setStatus('Error getting balance; see log.');
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
