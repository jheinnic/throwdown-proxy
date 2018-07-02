import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {Provider} from 'web3/types';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class Web3FactoryService {

  constructor() {
  }

  public adaptProvider(provider: Provider): Web3 {
    if (!! provider) {
      throw new Error('Provider must be defined');
    }
      return new Web3(provider);
  }
}
