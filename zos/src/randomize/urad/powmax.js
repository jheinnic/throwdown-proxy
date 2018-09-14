const urad = require('unique-random-at-depth')
const process = require('process');
const fs = require('fs');

const [minValIn, maxValIn, numValsIn, rptIntvIn] = process.argv.slice(2, 7);

const minVal = !!minValIn ? parseInt(minValIn) : 0;
const maxVal = !!maxValIn ? Math.pow(2, parseInt(maxValIn)) - 1 : (Math.pow(2, 54) - 1);
const numVals = !!numValsIn ? parseInt(numValsIn) : 100000;
const rptIntv = !!rptIntvIn ? parseInt(rptIntvIn) : 0;

const filename = `uradData-${numVals}_of_${minVal}_to_${maxVal}.json`;

console.log(filename);

const src = urad(minVal, maxVal, numVals);
const dst = [];

if (rptIntv == 1) {
    for( let ii=0; ii<numVals; ii++ ) {
        dst[ii] = src();
        console.log(ii);
    }
} else if (rptIntv == 0) {
    for( let ii=0; ii<numVals; ii++ ) {
        dst[ii] = src();
    }
} else if (rptIntv < 0) {
   console.error('Report interval may not be negative!');
   throw 'Report interval may not be negative!';
} else {
    const tgtMod = rptIntv - 1;
    for( let ii=0; ii<numVals; ii++ ) {
        dst[ii] = src();
        if ((ii % rptIntv) == tgtMod) {
            console.log(ii+1);
        }
    }
}

fs.writeFileSync(filename, dst, {flag: 'w'});


/*
for( let ii=0; ii<numVals; ii++ ) {
    const val = src();
    if (dst.has(val)) {
        console.error(`Collision on ${val} at ${ii} !!!`);
    } else {
        dst.add(val);
    }
}

const data = JSON.stringify(
    Array.from(
        dst.values()
    )
);
fs.writeFileSync(filename, data, {flag: 'w'});
*/

