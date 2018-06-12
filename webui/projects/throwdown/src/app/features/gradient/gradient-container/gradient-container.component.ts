import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/subscription';
import {NGXLogger} from 'ngx-logger';

import {GradientTokenService} from '../gradient-token.service';
import {Web3Service} from '../../../../../../jchptf/ngx-web3/src/lib/web3.service';

@Component({
  selector: 'tdn-gradient-container',
  templateUrl: './gradient-container.component.html',
  styleUrls: ['./gradient-container.component.css']
})
export class GradientContainerComponent implements OnInit, OnDestroy {
  @Input() color1 = '#000000';
  @Input() color2 = '#FFFFFF';

  accountSubscription: Subscription;

  status = '';
  accounts: string[];
  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  constructor(
    private web3Service: Web3Service, private gradientTokenService: GradientTokenService,
    private logger: NGXLogger)
  {
    this.logger.info('Constructor: ', web3Service, gradientTokenService);
  }

  ngOnInit() {
    if (this.gradientTokenService.isDeployed()) {
      this.logger.info('Gradient Token service has been bootstrapped ready');
    } else {
      this.logger.error('Gradient Token service has not been bootstrapped');
    }

    this.watchAccount();
  }

  ngOnDestroy() {
    if (!!this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = undefined;
    }
  }

  watchAccount() {
    this.accountSubscription = this.web3Service.pollClaimedAccounts().subscribe(
      (accounts: string[]): void => {
        this.logger.info('Accounts', accounts);
        this.accounts = accounts;
        this.model.account = accounts[0];
        // this.model.balance = await this.metaCoinInstance.tokenOfOwnerByIndex(this.model.account, 1);
        this.logger.info('About to refresh with', this.gradientTokenService);
        this.refreshBalance();
        this.logger.info(this.model.account);
      }
    );
    // this.web3Service.refreshAccounts();
  }

  setStatus(status) {
    this.status = status;
  }

  sendCoin() {
    if (!this.gradientTokenService.isDeployed()) {
      this.setStatus('GradientToken instance not deployed; unable to send transaction');
      return;
    }

    // const amount = this.model.amount;
    const receiver = this.model.receiver;

    // this.logger.info('Sending ' + amount + ' coins to ' + receiver);
    this.logger.info('Minting ' + this.color1 + ' -> ' + this.color2);

    this.setStatus('Initiating minting transaction... (please wait)');

    // this.metaCoinInstance.sendCoin(receiver, amount, {from: this.model.account}).then((success) => {
    this.gradientTokenService.mint(this.color1, this.color2, {from: this.model.account, to: receiver})
      .then(
        async (success): Promise<number> => {
          let retVal: number;
          if (!success) {
            this.setStatus('Transaction failed!');
            retVal = -999;
          } else {
            this.setStatus('Transaction complete!');
            retVal = await this.refreshBalance();
          }

          return retVal;
        }
      )
      .catch(
        (e) => {
          this.logger.error('Error sending coin', e);
          this.setStatus('Error sending coin; see log.');
          return -42;
        }
      );
  }

  refreshBalance(): Promise<number> {
    this.logger.info('Refreshing balance');

    return this.gradientTokenService.tokenOfOwnerByIndex(this.model.account, 1/*, {from: this.model.account}).then(
      (value: number) => {
        this.logger.info('Found balance: ', value);
        this.model.balance = value.valueOf();
        return value.valueOf();
      }
    ).catch((e: any) => {
      this.logger.error('Failed to refresh balance', e);
      this.setStatus('Error getting balance; see log.');
      return -5000;
    }*/);
  }

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
