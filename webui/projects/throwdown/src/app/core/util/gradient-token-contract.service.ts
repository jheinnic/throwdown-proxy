import {Injectable} from '@angular/core';
import Web3 from 'web3';
import * as Web3Types from 'web3/types';

import {Web3Service} from './web3.service';
import {GradientToken} from './gradient-token.interface';
import {Gradient} from './gradient.interface';

@Injectable({
  providedIn: 'root'
})
export class GradientTokenContractService implements GradientToken {
  constructor(private web3Service: Web3Service) {
  }

  private gradientTokenContract: any; // Web3Types.Contract;
  private deployedGradientToken: GradientToken;

  public async setupContract(gradient_artifact: any): Promise<GradientTokenContractService> {
    this.gradientTokenContract = this.web3Service.setupContract(gradient_artifact);
    this.deployedGradientToken = await this.gradientTokenContract.deployed();
    return this;
  }

  public deployed(): GradientToken {
    return this.deployedGradientToken;
  }

  getGradient(gradientId: number): Gradient {
    return this.deployedGradientToken.getGradient(gradientId);
  }

  mint(outer: string, inner: string, options: any): Promise<any> {
    return this.deployedGradientToken.mint(outer, inner, options);
  }

  name(): string {
    return this.deployedGradientToken.name();
  }

  symbol(): string {
    return this.deployedGradientToken.symbol();
  }

  tokenByIndex(index: number): number {
    return this.deployedGradientToken.tokenByIndex(index);
  }

  tokenOfOwnerByIndex(owner: any, index: number): number {
    return this.deployedGradientToken.tokenOfOwnerByIndex(owner, index);
  }

  tokenURI(gradientId: number): string {
    return this.deployedGradientToken.tokenURI(gradientId);
  }

  totalSupply(): number {
    return this.deployedGradientToken.totalSupply();
  }
}
