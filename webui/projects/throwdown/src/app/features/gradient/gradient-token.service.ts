import {Injectable} from '@angular/core';
import {take, timeout, filter} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

import {GradientToken} from './gradient-token.interface';
import {Gradient} from './shared/model/gradient.interface';
import {Web3Service} from '../../../../../jchptf/ngx-web3/src/lib/web3.service';

declare let require: any;
const gradient_token_artifact = require('../../../../build/contracts/GradientToken.json');
// console.log(gradient_token_artifact);


@Injectable({
  providedIn: 'root'
})
export class GradientTokenService implements GradientToken {
  constructor(private web3Service: Web3Service, private logger: NGXLogger) {
    this.logger.info('Constructing GradientTokenService');
  }

  private gradientTokenContract: any; // Web3Types.Contract;
  private deployedGradientToken: GradientToken;
  private deploymentPromise: Promise<boolean> | undefined;

  public setupContract(): Promise<boolean> {
    if (! this.deploymentPromise) {
      this.deploymentPromise = new Promise<boolean>(
        (resolve, reject) => {
          this.web3Service.initialized$.pipe(
            filter((initState: boolean) => initState),
            take(1),
            timeout(25000)
          ).subscribe(
            (initState: boolean) => {
              this.gradientTokenContract = this.web3Service.initTruffleContract(gradient_token_artifact);
              this.gradientTokenContract.deployed()
                .then((deployedToken) => {
                  this.deployedGradientToken = deployedToken;
                });
              this.logger.info('Initialized deployed GradientToken contract', this.deployedGradientToken);
              return resolve(true);
            },
            (err: any) => {
              this.logger.error('Failed to initialize GradientToken contract', err);
              return reject(err);
            },
            () => {
              if (! this.gradientTokenContract) {
                this.logger.error('Failed to initialize GradientToken contract');
                return reject(undefined);
              }
            }
          );
        }
      );
    }

    return this.deploymentPromise;
  }

  public isDeployed(): boolean {
    return !! this.deployedGradientToken;
  }

  // public deployed(): GradientToken {
  //   return this.deployedGradientToken;
  // }

  public getGradient(gradientId: number): Promise<Gradient> {
    return this.deployedGradientToken.getGradient(gradientId);
  }

  mint(outer: string, inner: string, options: any): Promise<any> {
    return this.deployedGradientToken.mint(outer, inner, options);
  }

  name(): Promise<string> {
    return this.deployedGradientToken.name();
  }

  symbol(): Promise<string> {
    return this.deployedGradientToken.symbol();
  }

  tokenByIndex(index: number): Promise<number> {
    return this.deployedGradientToken.tokenByIndex(index);
  }

  // tokenOfOwnerByIndex(owner: any, index: number, options: any): Promise<number> {
  tokenOfOwnerByIndex(owner: any, index: number): Promise<number> {
    return this.deployedGradientToken.tokenOfOwnerByIndex(owner, index);
  }

  tokenURI(gradientId: number): Promise<string> {
    return this.deployedGradientToken.tokenURI(gradientId);
  }

  totalSupply(): Promise<number> {
    return this.deployedGradientToken.totalSupply();
  }
}
