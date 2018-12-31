import {BitOutputStream} from "@thi.ng/bitstream";
import * as readline from "readline";

let inputs: string[] = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  if (line && (line.length > 0)) {
     console.log(
         parse(line).toString('hex');
     );
  }
});

function parse(bits: string): Buffer {
    const writer: BitOutputStream = new BitOutputStream();

    bits.split('').forEach( (bit: string) => {
        if (bit === '1') {
            writer.writeBit(1);
        } else {
            writer.writeBit(0);
        }
    });

    return Buffer.from(writer.bytes());
}
