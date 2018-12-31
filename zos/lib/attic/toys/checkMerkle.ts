import {BitOutputStream} from '@thi.ng/bitstream';
import * as readline from 'readline';
import {SHA256Compress} from './SHA256Compress';

// const default_iv_words = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
// 0x1f83d9ab, 0x5be0cd19];
// const iv_out = new BitOutputStream();
// iv_out.writeWords(default_iv_words, 32);
// const default_iv = Buffer.from(iv_out.bytes());

let inputs: string[] = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  // console.log(line.length);
  inputs.push(line);
  if (inputs.length === 3) {
     verify_hash_relation(inputs[0], inputs[1], inputs[2]);
     inputs = [];
  }
});

function parse(bits: string, writer: BitOutputStream) {
    bits.split('').forEach( (bit: string) => {
        if (bit === '1') {
            writer.writeBit(1);
        } else {
            writer.writeBit(0);
        }
    });
}


function verify_hash_relation(lbin: string, rbin: string, digest: string) {
    const mout = new BitOutputStream();
    const dout = new BitOutputStream();

    parse(lbin, mout);
    parse(rbin, mout);

    const computed_hash = SHA256Compress(Buffer.from(mout.bytes()));
    // const cin: BitInputStream = new BitInputStream(computed_hash);
    // const cstr: string = cin.readWords(256, 1).join('');
    const computed_hash_in_hex = computed_hash.toString('hex');

    console.log('');
    console.log(computed_hash_in_hex);

    parse(digest, dout);
    const expected_hash_in_hex =
        Buffer.from(
            dout.bytes())
        .toString('hex');
    console.log(expected_hash_in_hex);

    if (computed_hash_in_hex !== expected_hash_in_hex) {
       console.error("Computed and expected hash strings differ!");
    } else {
       console.log("Matched!");
    }
}

