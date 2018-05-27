import {Component, Input, OnInit} from '@angular/core';

import {Web3Service} from '../../../core/util/web3.service';
import {GradientToken} from '../../../core/util/gradient-token.interface';
import {GradientTokenContractService} from '../../../core/util/gradient-token-contract.service';

@Component({
  selector: 'tdn-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {
  @Input() color1: string = '#000000';
  @Input() color2: string = '#FFFFFF';
  accounts: string[];
  metaCoinInstance: GradientToken;
  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };
  status = '';

  constructor(private web3Service: Web3Service, private gradientTokenService: GradientTokenContractService) {
    console.log('Constructor: ', web3Service, gradientTokenService);
  }

  async ngOnInit() {
    this.watchAccount();
    this.metaCoinInstance = await this.gradientTokenService.deployed();
    this.model.balance = this.metaCoinInstance.tokenOfOwnerByIndex(this.model.account, 1);
    console.log(this.model.balance);
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe({
      next: (account: string) => {
        this.accounts = [account];
        this.model.account = account;
        console.log(this.model.account);
      }
    });
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

    console.log('Sending ' + amount + ' coins to ' + receiver);
    console.log('Minting ' + this.color1 + ' -> ' + this.color2 );

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

  };

  refreshBalance() {
    console.log('Refreshing balance');


    this.metaCoinInstance.tokenOfOwnerByIndex.call(this.model.account).then((value) => {
      console.log('Found balance: ', value);
      this.model.balance = value.valueOf();
    }).catch(function (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    });
  };

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
