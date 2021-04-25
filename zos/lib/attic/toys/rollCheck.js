const crypto = require('crypto');
const BigNumber = require('bignumber.js');
const cfg = BigNumber.config();
cfg.RANGE[1] = 1000000000;
cfg.EXPONENTIAL_AT[1] = 1000000000;
BigNumber.config(cfg);

const TICKET_COUNT = 1900000;
const SCALE = 25;

function allocateDist(size)
{
   let dist = [];
   for (let ii = 0; ii < size; ii++) {
      dist[ii] = 0;
   }

   return dist;
}

const dist = [
   allocateDist(SCALE * SCALE * SCALE),
   allocateDist(SCALE * SCALE * SCALE),
   allocateDist(SCALE * SCALE * SCALE),
   allocateDist(SCALE * SCALE * SCALE),
   allocateDist(SCALE * SCALE * SCALE)
];

const house = [];
const player = [];
const eth = [];

for (let ii = 0; ii < SCALE; ii++) {
   house[ii] = crypto.randomBytes(32);
   player[ii] = crypto.randomBytes(32);
   eth[ii] = crypto.randomBytes(32);
}

for (let ii = 0, nn = 0; ii < SCALE; ii++) {
   console.log(`Starting pass ${ii}`);
   for (let jj = 0; jj < SCALE; jj++) {
      if( (jj > 0) && ((jj%20) == 0)) {
         console.log(`Starting pass ${ii}-${jj}`);
      }
      for (let kk = 0; kk < SCALE; kk++, nn++) {
         let hash,
           h,
           n,
           v;

         h = Buffer.concat([house[ii], player[jj], eth[kk]])
           .toString('hex');
         n = new BigNumber(h, 16);
         v = n.mod(TICKET_COUNT)
           .toNumber();
         dist[1][nn] = v;

         hash = crypto.createHash('sha256');
         hash.update(house[ii])
         hash.update(player[jj])
         hash.update(eth[kk])
         h = hash.digest()
           .toString('hex');
         n = new BigNumber(h, 16);
         v = n.mod(TICKET_COUNT)
           .toNumber();
         dist[0][nn] = v;

         let k = [house[ii], player[jj], eth[kk], h];
         let hk = [-1, -1, 0, 2, 1];
         for (let zz = 2; zz < 5; zz++) {
            k.splice(0, 0, ...k.splice(3, 1));
            k.splice(2, 0, ...k.splice(3, 1));
            k.splice(1, 0, ...k.splice(2, 1));
            k.splice(2, 0, ...k.splice(2, 1));

            hash = crypto.createHash('sha256');
            hash.update(k[0]);
            hash.update(k[1]);
            hash.update(k[2]);
            hash.update(k[3]);
            h = hash.digest()
              .toString('hex');
            n = new BigNumber(h, 16);
            v = n.mod(TICKET_COUNT)
              .toNumber();

            dist[zz][nn] = v;
            k[hk[zz]] = h;
         }
      }
   }
}

for (let ii = 0; ii < SCALE; ii++) {
   house[ii] = Buffer.from(house[ii]).toString('hex');
   player[ii] = Buffer.from(player[ii]).toString('hex');
   eth[ii] = Buffer.from(eth[ii]).toString('hex');
}

fs = require('fs');
fs.writeFileSync('sampleData.dat', JSON.stringify(dist));
fs.writeFileSync('keys.dat', JSON.stringify([house, player, eth]));

module.exports = dist;
