const SHA256Compress = require('./dist/SHA256Compress').SHA256Compress;
const crypto = require('crypto');
const sha256 = require('sha2').sha256;

let zeros = []
for (let ii=0; ii<32; ii++) {
    zeros[ii] = 0;
}

let padding = [...zeros];
padding[0] = 128;
padding[30] = 1;

const ctrlHasherOne = crypto.createHash('sha256');
const message = crypto.randomBytes(32);
const inputA = message.hexSlice(0);

ctrlHasherOne.update(message);
const control01A = ctrlHasherOne.digest().hexSlice(0);
const control02A = sha256(message).hexSlice(0);
const baselineA = SHA256Compress(Buffer.from([...message, ...zeros])).hexSlice(0);

const fixedMessage = Buffer.from([...message, ...padding]);
const experimentA = SHA256Compress(fixedMessage).hexSlice(0);

console.log(`For input ${inputA}\n## Baseline: ${baselineA}\n## Control One: ${control01A}\n## Control Two: ${control02A}\n## Hypothesis Test Result: ${experimentA}\n`);
