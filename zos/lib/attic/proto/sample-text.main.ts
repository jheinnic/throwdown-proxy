const freqs = [0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150, 0.01974, 0.00074 ];
const alpha = 'abcdefghijklmnopqrstuvwxyz';

const counts = freqs.map( val => Math.round(val * 255) );
console.log(counts);
let mixStr = '';
for (let ii=0; ii<26; ii++ ) {
   const letter = alpha[ii];
   const count = counts[ii];
   mixStr = mixStr + letter.repeat(count);
}
console.log(alpha);
console.log(counts);
console.log(mixStr);

import * as mathjs from 'mathjs';
const distLen = mixStr.length;
const mixDist: string[] = new Array(256);
console.log(distLen);
for (let ii=0; ii<distLen; ii++ ) {
   mixDist[ii] = mixStr[ii];
}

mixDist[253] = alpha[Math.round( mathjs.random(0, 25))];
mixDist[254] = alpha[Math.round( mathjs.random(0, 25))];
mixDist[255] = alpha[Math.round( mathjs.random(0, 25))];

// console.log(mixDist);

let swap: string;
for (let ii=0; ii<distLen; ii++ ) {
   const target =Math.round( mathjs.random(ii, distLen));
   if (target != ii) {
      console.log( mixDist[ii], mixDist[target]);
      swap = mixDist[ii];
      mixDist[ii] = mixDist[target];
      mixDist[target] = swap;
   }
   if( mathjs.random(0, 1) < 0.25) {
      mixDist[ii] = mixDist[ii].toUpperCase();
   }
}
console.log(mixDist.join(''));
// console.log(mixDist.join(''));
