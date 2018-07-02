import * as Web3 from 'web3';

import {ITxParams, Wavelets02Verifier} from '../lib';

// Local Truffle develop (port 9545)
// const CONTRACT_ADDRESS = '0xa1d02e5593c173ac3108bdb224236c57bfc83ed5';

// Local Geth chain deployment (port 8545, 8546, or 8547)
const CONTRACT_ADDRESS = '0x43afb184f6ed53422e081dcaa935e279d17ad433';

// Local and ephemeral Ganache chain deployment (port 8501)
// const CONTRACT_ADDRESS = '0xddc43349b4b467e7a157a577e8b7fc6180d7e35f';

// Local Truffle Develop
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

// Local Geth
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

interface Proof
{
   a: string[];
   a_p: string[];
   b: string[][];
   b_p: string[];
   c: string[];
   c_p: string[];
   h: string[];
   k: string[];
}

const proof01: Proof = {
   a: [
      '0x16d071395e1db3a055af8194036d1ee88d36b9ae352ae767fc3c4192a2452166',
      '0x1f99e0cce1f094c80bfe3f18867422bf75663313ab6c966601b6de5d58c8383b'
   ],
   a_p: [
      '0x2e291274048e59324e557bdab0b58a699f1dfbd4447843ead65ee9cfcf73ef55',
      '0x2ddb3faab70866d7856d25d67e011021d1596c6a1840d80b3f85187f187b3c2'
   ],
   b: [
      [
         '0x23bf9034992b4be1c71a09aaefb0e91885967dc954bc323da9914d5fbb0e2cca',
         '0xab91b05e7b47909fa29d02ffcd67a73616a638bf15b9c58222a46d572317823'
      ], [
         '0x285f0f8253b35fedb0bdaa680c63dc7b1c0a2280a03b92d761fe8f18efddb200',
         '0x1b7e196eed26ef52e030402b42f1b864216d89488ce3272a2cd308abe2aba8b5'
      ]
   ],
   b_p: [
      '0xc10d07971af931251e0061c55537259317a793445060108af5716b1b83f0a7d',
      '0x486c083990a2b7a864c5e1abd4da8027f220942bd1537fceeff4a83127cad0d'
   ],
   c: [
      '0x1429121a837db8b7539c9f7d6f48ec4f951a17c212fed7adf484c965cc77aa07',
      '0xd45f0eac4b077d6c5b52f7fe867f7720271d3dcd0b8291d40f0ba3d28ab8753'
   ],
   c_p: [
      '0x301740cd9f6351bbae11f260daf043df87520acbf87995c230911e76d3b51f64',
      '0x1d09eafd399597edbbf63654606c8b1396aaf406aa955e8ce8d81e1ac1f2107a'
   ],
   h: [
      '0xf65e288e48ec05f4403a6e6c4e473fb13cf07e3b471e7df672b4865944874bc',
      '0x23bd89a03ded6607d50e936836a11125be511b953eb1d9395207679710da3148'
   ],
   k: [
      '0x20398ab6c3ea5895da09a498d60341b4b347b6be192bede49ffa125ff332730e',
      '0xd8768822cad1ee7b905ce422efc9e739136e4daa84bb31d66d6b691e276c3cd'
   ]
};

const input = ['12209', '13282', '7492', '12209', '11642', '351', '2736030358979909402780800718157159386068545550052004292962275523321976062194'];

  Wavelets02Verifier.createAndValidate(web3, CONTRACT_ADDRESS)
  .then(
    (vc: Wavelets02Verifier) => {
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
       const {a, a_p, b, b_p, c, c_p, h, k} = proof01;

       let txPromise;
       let counter = 0;
       while (counter++ < 1) {
          console.log(
            `In call to verifyTx(${a}, ${a_p}, ${b}, ${b_p}, ${c}, ${c_p}, ${h}, ${k}, ${input})`);

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

function keepAlive()
{
   setTimeout(keepAlive, 25000);
}

keepAlive();


