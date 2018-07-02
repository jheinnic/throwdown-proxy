import * as Web3 from 'web3';
import {Chance} from 'chance';

import {BigNumber, ITxParams, Verifier} from '../lib';
import {VerifierContractFactory} from '../lib/VerifierContractFactory';

// Local Truffle develop (port 9545)
// const CONTRACT_ADDRESS = '0xa1d02e5593c173ac3108bdb224236c57bfc83ed5';

// Local Geth chain deployment (port 8545, 8546, or 8547)
const CONTRACT_ADDRESS = '0xd1718b70cc8a509c3033a90d8e1fd77acbd5740f';

// Local and ephemeral Ganache chain deployment (port 8501)
// const CONTRACT_ADDRESS = '0xddc43349b4b467e7a157a577e8b7fc6180d7e35f';

// Local Truffle Develop
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

// Local Geth
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const a = [
   new BigNumber('0x2cca0429d0a9aa2afa70dd64e87f8c4c6f07cbddddc825cc4bec429f452d6f44'),
   new BigNumber('0xa074dbd0c9de0c982354f9d74c6c867ea1a9c2d5b64e3133927182551acfc0a')
];
const a_p = [
   new BigNumber('0x155027d202df60149e75a76f633800ae757cd592be9c208b901f60457bc5ff9a'),
   new BigNumber('0x151ac90947818a7aa98ed4518636d76aab2b08a776f80e74a9580b952da61ecd')
];
const b = [
   [
      new BigNumber('0x25915b7134c76b15a5be829c1505463e14906a5d48f2bf1efc1cb200e965f879'),
      new BigNumber('0x17b97a2cbbb5834286662da6463a99eeb572fd2741e3cc19f2e642f3b6e76554')
   ], [
      new BigNumber('0x1c7ca3781860316f8b2bdc09a80da8329d864ff9c2e6a99b51328e99e6aba2c8'),
      new BigNumber('0x2c9a2b88923ff0d689978fc2ec1e46ad96ef9ceb9aacfcd62e7996ba25eed965')
   ]
];
const b_p = [
   new BigNumber('0x1c86e9d89fc4a10274327a6252d563be40359617c4ff8976c2e524fd6e7e3310'),
   new BigNumber('0x6824b0f9f80b393fd1a4cb7b141e3290b2921c2b17eff533ceb260d6e65f136')
];
const c = [
   new BigNumber('0x2a8fbd62ff6057a8549f15f81a2dce11911279e4f81ae54d3d9ccb8fef75533c'),
   new BigNumber('0x1e3d3688794599909593cfb16c2fb0c35b95e043827766be121b39c3fa90f993')
];
const c_p = [
   new BigNumber('0x29265d4ef7ee5d23b51fd6d5b9183a3f1948eabe1f9c773529272cd3d13ec7b3'),
   new BigNumber('0x26ed7bcd4a3d7d31a4a05cdbefbd58a20106b6301f6224f30683b003439c373')
];
const h = [
   new BigNumber('0x63827451f66917bb3860eb652821ab02d8b2e5545dba5f01569bd65683e8919'),
   new BigNumber('0x142ef0e1e727ef41c32ef151c2404577de4408e9d232450cacef16a58343947a')
];
const k = [
   new BigNumber('0x5e384672a3c8244d1f6a03fc428025cd0e94029d114539a31521d8c8308c240'),
   new BigNumber('0x2d6fe064a352e513040427a806a56b18d27f17ffe99234bb1fa840b93ad7a730')
];

const input = [new BigNumber(6), new BigNumber(3), new BigNumber(20)];

VerifierContractFactory.createAndValidate(web3, CONTRACT_ADDRESS)
  .then(
    (v: VerifierContractFactory) => {
       const vc: Verifier = v.getVerifier();

       vc.VerifiedEvent({})
         .watch({})
         .subscribe((event: any) =>
       {
          console.log('On Verified:', event, event.data);
       });

       vc.PrecompiledCallEvent({})
         .watch({})
         .subscribe((event: any) =>
         {
            console.log('On PrecompiledCall:', event, event.data);
         });

       const ethTxParams: ITxParams = {
          from: web3.personal.listAccounts[1],
          gas: 41250040868765000,
          gasPrice: 8e6
       };

       let txPromise;
       let counter = 0;
       while (counter++ < 1) {
          console.log(`In call to verifyTx(${a}, ${a_p}, ${b}, ${b_p}, ${c}, ${c_p}, ${h}, ${k}, ${input})`);

          // txPromise = vc.testEmitTx()
          txPromise =
            vc.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input)
              .send(ethTxParams)
              .then((result) => {
                   console.log(`call returned ${result} for ${input}`);
                }
              )
              .catch((err: any) => {
                 console.error(`query fell on its face with ${err}`);
              });
       }

       return txPromise;
    }
  )
  .then(
    (data: any) => {
       console.log('Success?', data);
    }
  )
  .catch(
    (err: any) => {
       console.error(`kee-rie fah dow, guh boom, wid ${err} fuh ${input}`);
    }
  );

function keepAlive( ) {
   setTimeout(keepAlive, 25000);
}
keepAlive();


