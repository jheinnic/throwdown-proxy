import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/subscription';

import {GradientToken} from '../../gradient/gradient-token.interface';
import {GradientTokenService} from '../../gradient/gradient-token.service';
import {Web3Service} from '../../../../../../jchptf/ngx-web3/src/lib/web3.service';

@Component({
  selector: 'tdn-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit, OnDestroy {
  @Input() color1 = '#000000';
  @Input() color2 = '#FFFFFF';
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

  constructor(private web3Service: Web3Service, private gradientTokenService: GradientTokenService) {
    console.log('Constructor: ', web3Service, gradientTokenService);
  }

  async ngOnInit() {
    console.log(await this.watchAccount());
    if (this.gradientTokenService.isDeployed()) {
      // this.model.balance = await this.gradientTokenService.tokenOfOwnerByIndex(this.model.account, 1, {from: this.model.account});
      this.model.balance = await this.gradientTokenService.tokenOfOwnerByIndex(this.model.account, 1);
      console.log(this.model.balance);
    }
  }

  ngOnDestroy() {
    if (!!this.accountSubscription) {
      this.accountSubscription.unsubscribe();
      this.accountSubscription = undefined;
    }
  }

  watchAccount() {
    return new Promise((reject, resolve) => {
      this.accountSubscription = this.web3Service.pollClaimedAccounts()
        .subscribe((accounts: string[]): void => {
            this.accounts = accounts;
            this.model.account = accounts[0];
            console.log(this.model.account);
            if (!! resolve) { resolve(accounts[0]); resolve = undefined; }
          }
        );
    });
  }

  setStatus(status) {
    this.status = status;
  }

  sendCoin() {
    if (!this.metaCoinInstance) {
      this.setStatus('metaCoinInstance is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    console.log('Sending ' + amount + ' coins to ' + receiver);
    console.log('Minting ' + this.color1 + ' -> ' + this.color2);

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
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    });
  }

  refreshBalance() {
    console.log('Refreshing balance');


    this.metaCoinInstance.tokenOfOwnerByIndex.call(this.model.account).then((value) => {
      console.log('Found balance: ', value);
      this.model.balance = value.valueOf();
    }).catch(function (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    });
  }

  clickAddress(e) {
    this.model.account = e.target.value;
    this.refreshBalance();
  }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }
}
