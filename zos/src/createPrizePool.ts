// import * as sjcl from 'sjcl';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as hdkey from 'ethereumjs-wallet/hdkey';
import {asyncScheduler, from, merge, NEVER, range, zip} from 'rxjs';
import {buffer, bufferCount, filter, flatMap, map, scan, shareReplay} from 'rxjs/operators';
import {BitInputStream, BitOutputStream} from '@thi.ng/bitstream';
import {MerkleTree} from './lib/merkle-tree';

//  fs.writeFileSync('private.key', signKey.privateKey);
// fs.writeFileSync('public.key', signKey.publicKey);
// fs.writeFileSync(`${signKey.network}.wif`, signKey.toWIF());
// fs.writeFileSync(`${signKey.network}.b58`, signKey.toBase58());

interface ProofBatchStrategy {
   readonly layerOrder: ProofForest[];
}

interface ProofForest {
   readonly rootLayerDepth: number;
   readonly depthPerTask: number;
   readonly leavesPerTask: number;
   readonly fullTaskCount: number;
   readonly partialTaskSize: number;
}

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
   poolIndex: string,
   serial: string,
   publicKey: string,
   privateKey: string,
   hmacSignature: string
}

const poolDir = './mypool';
const configDir = path.join(poolDir, 'config');
const gameSpecFile = path.join(configDir, 'game_spec.json');
const proofSpecFile = path.join(configDir, 'proof_tree_spec.json');

const gameSpec = require(gameSpecFile);
const proofSpec = require(proofSpecFile);
const prizeDist: TierDistribution[] = gameSpec.prizeTiers;

// const noWinCount = gameSpec.noWinCount;
// const hasWinCount = gameSpec.prizeTiers.reduce(
//   (agg, item) => ((item.value > 0) ? (agg + item.prizeCount) : agg), 0);
const totalTicketCount = gameSpec.prizeTiers.reduce(
  (agg, item) => ((item.value > 0) ? (agg + item.prizeCount) : agg), 0);

const hashType = 'sha256';
const hdRoot = bip32.fromSeed(
  bip39.mnemonicToSeed(proofSpec.bip39.mnemonic)
);

const treeDepth = Math.ceil(Math.log2(noWinCount + hasWinCount));
const proofDepthOrder = computeProofStrategy(treeDepth, proofSpecFile.proofDepths);

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


interface PlanStackFrame {
   currentProofIndex: number;
}
module.exports = computeProofStrategy;

// Greedy algorithm for finding an optimal layer decomposition.
function computeProofStrategy(targetDepth, totalLeafCount, availableProofDepths) {
   const sortedDepths = availableProofDepths.sort( (a, b) => a - b );
   const numDepths = sortedDepths.length;

   const deepestProof = sortedDepths[numDepths - 1];
   const shortestProof = sortedDepths[0];
   const minSteps = Math.ceil(targetDepth / deepestProof);
   const maxSteps = Math.ceil(targetDepth / shortestProof);
   const planStack = [];

   // Populate as many maxDepth layers as will fit in the target depth to start.
   let currentTop;
   let currentTotal = minSteps * deepestProof;
   for (let ii=0; ii<minSteps; ii++) {
      currentTop = { currentProofIndex: numDepths - 1 };
      planStack.push(currentTop);
   }

   let count = 1;
   while (currentTotal != targetDepth) {
      console.log('Count:', count++);
      console.log('Stack:', planStack);

      if (currentTotal < targetDepth) {
         // Score too low--add another card with the same rank as the latest 
         // card we have added.
         currentTop = { ...currentTop };
         planStack.push(currentTop);
         currentTotal += sortedDepths[currentTop.currentProofIndex];
      } else {
         // Score too high.  Discard current stack top until either we find a 
         // card that is not using smallest proof or no cards remain.
         while ((currentTop.currentProofIndex == 0) && (planStack.length > 0)) {
            currentTotal -= sortedDepths[currentTop.currentProofIndex];
            currentTop = planStack.pop();
         }

         // Score too high, and there are proof sizes smaller than one currentl
         // on top of stack.  Try replacing it with the next smaller proof.
         if (planStack.length > 0) {
            currentTop.currentProofIndex = currentTop.currentProofIndex - 1;
            currentTotal += sortedDepths[currentTop.currentProofIndex];
         }
      }
   }

   console.log('Count:', count++);
   console.log('Stack:', planStack);

   let nextTaskCount = totalLeafCount;
   let nextRootLayerDepth = 0;
   let leavesGroupedPerTask = 1;
   let layerOrder = planStack.map(
      (item, idx) => {
         const rootLayerDepth = nextRootLayerDepth;
         const depthPerTask = sortedDepths[item.currentProofIndex];

         const treesGroupedPerTask = Math.pow(2, depthPerTask);
	 const leavesGroupedPerTask *= treesGroupedPerTask;

         const partialTaskSize = nextTaskCount % leavesPerTask;
         const fullTaskCount = Math.floor(nextTaskCount / leavesPerTask);

         nextTaskCount = (partialTaskSize > 0) ? (fullTaskCount + 1) : fullTaskCount;
         nextRootLayerDepth = nextRootLayerDepth + depthPerTask;

         return {
             rootLayerDepth,
             depthPerTask,
             treeGroupedPerTask,
             leavesGroupedPerTask,
             fullTaskCount,
             partialTaskSize
         };
      }
   );

   return { layerOrder };
}


interface ProofBatchStrategy {
   readonly layerOrder: ProofForest[];
}

interface ProofForest {
   readonly rootLayerDepth: number;
   readonly depthPerTask: number;
   readonly leavesPerTask: number;
   readonly fullTaskCount: number;
   readonly partialTaskSize: number;
}

