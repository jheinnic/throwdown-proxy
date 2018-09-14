const urad = require('unique-random-at-depth')
const process = require('process');
const fs = require('fs');

const [minValIn, maxValIn, numValsIn] = process.argv.slice(2, 6);
const minVal = !!minValIn ? parseInt(minValIn) : 0;
const maxVal = !!maxValIn ? parseInt(maxValIn) : (Math.pow(2, 54) - 1);
const numVals = !!numValsIn ? parseInt(numValsIn) : 100000;
const filename = `uradData-${numVals}_of_${minVal}_to_${maxVal}.json`;

console.log(filename);

const src = urad(minVal, maxVal, numVals);
const dst = new Set();

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

