// import * as sjcl from 'sjcl';
import * as crypto from 'crypto';
import {asyncScheduler, from} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {range} from 'rxjs/internal/observable/range';
import {MerkleTree} from 'merkle-tree-payment-pool';
import * as hdkey from 'ethereumjs-wallet/hdkey';

// const createHmac = require('create-hmac');
// const createHash = require('create-hash');

const

const hashType = 'sha256';
const msgObj = {
   prizeTier: undefined,
   prizeValue: undefined,
   claimedBy: undefined,
   whiteSeed: undefined
};

const prizeDist = [
   {
      prizeTier: 11,
      prizeValue: 75000,
      prizeCount: 2
   },
   {
      prizeTier: 10,
      prizeValue: 5000,
      prizeCount: 16
   },
   {
      prizeTier: 9,
      prizeValue: 500,
      prizeCount: 480
   },
   {
      prizeTier: 8,
      prizeValue: 250,
      prizeCount: 790
   },
   {
      prizeTier: 7,
      prizeValue: 100,
      prizeCount: 4560
   },
   {
      prizeTier: 6,
      prizeValue: 50,
      prizeCount: 10735
   },
   {
      prizeTier: 5,
      prizeValue: 30,
      prizeCount: 14250
   },
   {
      prizeTier: 4,
      prizeValue: 20,
      prizeCount: 47500
   },
   {
      prizeTier: 3,
      prizeValue: 15,
      prizeCount: 95045
   },
   {
      prizeTier: 2,
      prizeValue: 10,
      prizeCount: 123500
   },
   {
      prizeTier: 1,
      prizeValue: 5,
      prizeCount: 190000
   }
];
const noWinCount = 1413127;

const tempDistro = [
   {
      prizeTier: 2,
      prizeValue: 10,
      prizeCount: 480
   },
   {
      prizeTier: 1,
      prizeValue: 5,
      prizeCount: 16
   }
].reverse();

from(tempDistro, asyncScheduler)
  .pipe(
    flatMap((prizeDist) => {
       // No longer secret shared secret ;-)
       const sharedSecret = 'super-secret';
       const query = 'key=value';
       const hmac = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(sharedSecret), sjcl.hash.sha256);
       const signature = sjcl.codec.hex.fromBits(hmac.encrypt(query));
       return [query, signature];

       return range(0, prizeDist.prizeCount)
         .pipe(
            map((prizeIndex: number) => {
               return {
                  prizeTier: prizeDist.prizeTier,
                  prizeValue: prizeDist.prizeValue,
                  prizeAddress:
            })
         )
    })s
  )
  .subscribe((sigPair) => {

  }
tempDistro.map((prizeTier) => {
   for (let ii = 0; ii < prizeTier.prizeCount; ii++) {

   }
});
