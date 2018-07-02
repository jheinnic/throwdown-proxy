import * as Web3 from 'web3';

import {ITxParams, Waldo02Verifier} from '../lib';

// Local Truffle develop (port 9545)
// const CONTRACT_ADDRESS = '0xa1d02e5593c173ac3108bdb224236c57bfc83ed5';

// Local Geth chain deployment (port 8545, 8546, or 8547)
const CONTRACT_ADDRESS = '0xe47c20b85bd266f8e5afd0f480af65daaac0c36f';

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

const proof01 = {
   a: [
      '0xdfd2baabfd4bcf97a990fe3df5bdad1cbf8ecd81c13c36e7efe1973420b0c1f',
      '0x233b35b5e01fe46b7f1600415a9950023ae5594c11f8750982bf386ae3eb7852'
   ],
   a_p: [
      '0xb885b8450ff5604f8443cc40338cd09e5aff0894c6e3a60e642ae19e4088ecb',
      '0x365d6ca1ae181467fdd953e713af56d4d6287535809c186bd3703b711c42247'
   ],
   b: [
      [
         '0x200be47cbc770b733ed4f709d2015bb9765ac4624ca0976c0e4d4755dd3a4697',
         '0x1a003ea7e0e0fea63f259ed693e3fa843581a8c8a0cd5ea0eb05cb84d1f2eec'
      ],
      [
         '0x1c0a810e97680d4124241f4a415bcc9d0f9a2686ef887d490db47cc498f3ced5',
         '0x2503f1f05f47753758127cb5d7fdfda25da4010b217456d3f2ec626c17af525a'
      ],
   ],
   b_p: [
      '0x171d8bf7dc621b535ee675ceabafa028bafcea5475715268907f7c9361af1eb9',
      '0x15476e873d9d0d0d0065fd468232b5a2721548a7549969d2d68c4ce0b0a23d39'
   ],
   c: [
      '0x1e736f8efbc70244f0faf029c5f4c27e3f184967dbbe41de7652dd42acbd3b88',
      '0x304880d4afed95e018cc88ea66d4e263bb17bb0b276a6d4d468f66330550e574'
   ],
   c_p: [
      '0xaeb26932cb8e7b9177379bcee586d2737ed809b51bb20a262b678809717cc6a',
      '0x7f2e8ff6d746b44451843ea8ce54bcc9c4ed55867996f0420ff3a8743d71238'
   ],
   h: [
      '0x27da3727e13ed6fdb31ad4a516f809bfaea7b14394eb652c1a7863ba20d0137d',
      '0x25ce8ba02ca509ae7e5caf4f1ccba6b791901c0dca423f2867cdad4490e6eaca'
   ],
   k: [
      '0x602cfc832321d3cbea2597c8fad7aed2a875e23ca635e1dcf93d98d64bf25fc',
      '0x296b8bd7a35aaa6a987f9497e3f6ffd8b7e2b4fadb9fedf729351895def2b104'
   ]
};

const input = [1015988797, 227243221, 73736855, 598706041, 2];

Waldo02Verifier.createAndValidate(web3, CONTRACT_ADDRESS)
  .then(
    (vc: Waldo02Verifier) => {
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


