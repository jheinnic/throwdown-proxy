// import {BigNumber} from "bignumber";
import {isaac} from "isaac";

class RandomBitsService {
   // private randomSource: any;

   constructor(seed: Uint32Array) {
      // let cfg = BigNumber.config();
      isaac.seed([...seed]);

      // this.randomSource = isaac;
   }

   createSampledSequence(valueCount: number, maxValue: BigNumber, blockSize = 8192): any {
      return sampleSequence(valueCount, maxValue, blockSize);
   }
}

function * sampleSequence(valueCount: number, maxValue: BigNumber, blockSize: number) {
   let returnCount = 0;
   let latestBlock = [];
   let nextBlockAt = 1;
   let samplePct = new BigNumber(valueCount).div(maxValue);

   for( let ii=0, cand=nextBlockAt; ii<blockSize; ii++, cand++ )
   {
      if (isaac.random() < samplePct) {
         latestBlock.push(cand);
      }
      while(returnCount < valueCount) {
         returnCount += latestBlock.length;
         nextBlockAt += blockSize;
         samplePct = new BigNumber(
           valueCount - returnCount
         ).div(nextBlockAt);

         while (latestBlock.length > 0) {
            yield a.unshift();
         }
      }
   }
}
