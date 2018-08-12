import {DecodedLogEntry, IWatchFilter, promisify} from './contracts/typechain-runtime';
import {BigNumber} from 'bignumber.js';
import {bindNodeCallback} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {Verifier} from './contracts/Verifier';

export class VerifierContractFactory
{
   public readonly rawWeb3Contract: any;

   private constructor(private readonly web3: any, private readonly address: string | BigNumber)
   {
      const abi = [
         {
            anonymous: false,
            inputs: [
               {
                  indexed: false,
                  name: 'message',
                  type: 'string'
               },
               {
                  indexed: false,
                  name: 'isGood',
                  type: 'bool'
               }
            ],
            name: 'Verified',
            type: 'event'
         },
         {
            constant: false,
            inputs: [
               {
                  name: 'a',
                  type: 'uint256[2]'
               },
               {
                  name: 'a_p',
                  type: 'uint256[2]'
               },
               {
                  name: 'b',
                  type: 'uint256[2][2]'
               },
               {
                  name: 'b_p',
                  type: 'uint256[2]'
               },
               {
                  name: 'c',
                  type: 'uint256[2]'
               },
               {
                  name: 'c_p',
                  type: 'uint256[2]'
               },
               {
                  name: 'h',
                  type: 'uint256[2]'
               },
               {
                  name: 'k',
                  type: 'uint256[2]'
               },
               {
                  name: 'input',
                  type: 'uint256[3]'
               }
            ],
            name: 'verifyTx',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
         }
      ];
      // super(web3, address, abi);
   }

   static async createAndValidate(
     web3: any,
     address: string | BigNumber
   ): Promise<VerifierContractFactory>
   {
      const contract = new this(web3, address);
      const code = await promisify(web3.eth.getCode, [address]);

      // in case of missing smart  contract, code can be equal to "0x0" or "0x" depending on exact web3
      // implementation to cover all these cases we just check against the source code length — there won't
      // be any meaningful EVM program in less then 3 chars
      if (code.length < 4) {
         throw new Error(`Contract at ${address} doesn't exist!`);
      }
      return contract;
   }

   public getVerifier()
   {
      return new Verifier(this.web3, this.address);
   }
}

