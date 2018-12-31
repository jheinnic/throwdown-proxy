// import * as sjcl from 'sjcl';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as hdkey from 'ethereumjs-wallet/hdkey';
import {asyncScheduler, from, merge, NEVER, range, zip} from 'rxjs';
import {buffer, bufferCount, filter, flatMap, map, scan, shareReplay} from 'rxjs/operators';
import {MerkleTree} from './lib/merkle-tree';

const mnemonic1 = 'reward decide comfort submit reopen average surface surge harbor work stove holiday'
  + ' balcony adjust more come brass before snow afford labor vocal plate flash';
const mnemonic2 = 'reward decide comfort submit reopen average surface surge harbor work stove holiday'
  + ' balcony adjust more come brass before snow afford labor vocal plate flash';
const mnemonic3 = 'reward decide comfort submit reopen average surface surge harbor work stove holiday'
  + ' balcony adjust more come brass before snow afford labor vocal plate flash';

const hdRoot = hdkey.fromMasterSeed(
  bip39.mnemonicToSeed(mnemonic1)
);
const signKey = bip32.fromSeed(
  Buffer.from(
      crypto.randomBytes(256)
  )
);
fs.writeFileSync('private.key', signKey.privateKey);
fs.writeFileSync('public.key', signKey.publicKey);
fs.writeFileSync(`${signKey.network}.wif`, signKey.toWIF());
fs.writeFileSync(`${signKey.network}.b58`, signKey.toBase58());

const hashType = 'sha256';

interface TierDistribution
{
   prizeTier: number,
   prizeValue: number,
   prizeCount: number
}

interface PrizeRegistration
{
   prizeTier: number,
   tierIndex: number,
   poolAddress: string,
   privateKey: string,
   publicKey: string,

   hmacSignature: string
}

const prizeDist: TierDistribution[] = [
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

const tempDistro: TierDistribution[] = [
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
const noWinCount = 1413127;
const hasWinCount = prizeDist.reduce((agg, item) => {
   return agg + item.prizeCount;
}, 0);

const allWinnersSource = from(prizeDist, asyncScheduler)
  .pipe(
    flatMap((prizeDist: TierDistribution) => {
       return range(1, prizeDist.prizeCount)
         .pipe(
           map((tierIndex: number) => Object.assign({tierIndex}, prizeDist)));
    }),
    shareReplay(prizeDist.length));

const secondChancesSource = range(0, noWinCount, asyncScheduler)
  .pipe(
    map((tierIndex: number) => {
       return {
          prizeTier: 0,
          tierIndex
       };
    })
  );

const allTicketValues = merge(allWinnersSource, secondChancesSource);

const allTicketIds = range(0, noWinCount + hasWinCount, asyncScheduler)
  .pipe(
    scan((pair: [any, string | undefined]): [any, string | undefined] => {
       const address: string = pair[0].getWallet()
         .getAddressString();
       const nextHd: any = pair[0].deriveChild(1);
       return [nextHd, address];
    }, [hdRoot, undefined]),
    filter((pair: [any, string | undefined]): boolean => (
      !!pair[1]
    )),
    map((pair: [any, string]) => {
       return {
          poolAddress: pair[1],
          filename: pair[0].getWallet().getAddressString() + '.dat'
       };
    })
  );

zip(allTicketIds, allTicketValues)
  .pipe(
    map((pair: [{ poolAddress: string }, { prizeTier: number, tierIndex: number }]): PrizeRegistration => {
       const retVal = Object.assign({
          hmacSignature: ''
       }, pair[0], pair[1]);
       retVal.hmacSignature = crypto.createHmac(hashType, signKey.privateKey)
         .update(`${pair[0].poolAddress} : ${pair[1].prizeTier} @ ${pair[1].tierIndex}`)
         .digest('hex');

       return retVal;
    }),
    map(
      (prizeRecord: PrizeRegistration) => {
         fs.writeFileSync(
           'data/' + prizeRecord.filename, JSON.stringify(prizeRecord), {
              encoding: 'utf8',
              mode: '0400'
           });
         return prizeRecord;
      }
    ),
    bufferCount(noWinCount + hasWinCount),
    map((records: PrizeRegistration[]) => {
       console.log('Begin building Merkle Tree...');
       const sorted = records.sort((a, b) => { return a.poolAddress < b.poolAddress ? -1 : a.poolAddress > b.poolAddress ? 1 : 0; });
       return new MerkleTree(sorted.map(
         (item) => item.hmacSignature
       )) as MerkleTree;
    }))
  .subscribe((mt: MerkleTree) => {
     console.log('Done');
     fs.writeFileSync('merkle.tree', JSON.stringify(mt), { encoding: 'utf8', mode: '0600' });
  }, console.error, console.info);
// prizeAddress =
//              return Object.assign({tieredPrizeIndex, prizeAddress}, prizeDist)
// No longer secret shared secret ;-)
// const sharedSecret = 'super-secret';
// const query = 'key=value';
// const hmac = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(sharedSecret), sjcl.hash.sha256);
// const signature = sjcl.codec.hex.fromBits(hmac.encrypt(query));
// return [query, signature];

// return range(0, prizeDist.prizeCount)
//   .pipe(
//      map((prizeIndex: number) => {
//         return {
//            prizeTier: prizeDist.prizeTier,
//            prizeValue: prizeDist.prizeValue,
//            prizeAddress:
//      })
//   )
// })s
// )
// .subscribe((sigPair) => {
//
// }
// tempDistro.map((prizeTier) => {
//    for (let ii = 0; ii < prizeTier.prizeCount; ii++) {
//
//    }
// });
